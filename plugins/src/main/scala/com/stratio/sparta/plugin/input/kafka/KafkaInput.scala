/*
 * Copyright (C) 2015 Stratio (http://stratio.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.stratio.sparta.plugin.input.kafka

import java.io.{Serializable => JSerializable}
import java.lang.{Double, Long}
import java.nio.ByteBuffer

import akka.event.slf4j.SLF4JLogging
import com.stratio.sparta.sdk.pipeline.input.Input
import com.stratio.sparta.sdk.properties.ValidatingPropertyMap._
import org.apache.kafka.clients.consumer._
import org.apache.kafka.common.serialization._
import org.apache.kafka.common.utils.Bytes
import org.apache.spark.sql.Row
import org.apache.spark.streaming.StreamingContext
import org.apache.spark.streaming.dstream.DStream
import org.apache.spark.streaming.kafka010._

import scala.util.Try

class KafkaInput(properties: Map[String, JSerializable]) extends Input(properties) with KafkaBase with SLF4JLogging {

  val KeyDeserializer = "key.deserializer"
  val ValueDeserializer = "value.deserializer"

  //scalastyle:off
  def setUp(ssc: StreamingContext, sparkStorageLevel: String): DStream[Row] = {
    val groupId = getGroupId("group.id")
    val metaDataBrokerList = if (properties.contains("metadata.broker.list"))
      getHostPort("metadata.broker.list", DefaultHost, DefaultBrokerPort)
    else getHostPort("bootstrap.servers", DefaultHost, DefaultBrokerPort)
    val keySerializer = classOf[StringDeserializer]
    val serializerProperty = properties.getString("value.deserializer", "string")
    val valueSerializer = getSerializerByKey(serializerProperty)
    val serializers = Map(KeyDeserializer -> keySerializer, ValueDeserializer -> valueSerializer)
    val topics = extractTopics
    val partitionStrategy = getPartitionStrategy
    val locationStrategy = getLocationStrategy
    val autoOffset = getAutoOffset
    val enableAutoCommit = getAutoCommit

    val inputDStream = serializerProperty match {
      case "long" =>
        val consumerStrategy = ConsumerStrategies.Subscribe[String, Long](topics, enableAutoCommit ++
          autoOffset ++ serializers ++ metaDataBrokerList ++ groupId ++ partitionStrategy ++ getCustomProperties)
        KafkaUtils.createDirectStream[String, Long](ssc, locationStrategy, consumerStrategy)
      case "int" =>
        val consumerStrategy = ConsumerStrategies.Subscribe[String, Int](topics, enableAutoCommit ++
          autoOffset ++ serializers ++ metaDataBrokerList ++ groupId ++ partitionStrategy ++ getCustomProperties)
        KafkaUtils.createDirectStream[String, Int](ssc, locationStrategy, consumerStrategy)
      case "double" =>
        val consumerStrategy = ConsumerStrategies.Subscribe[String, Double](topics, enableAutoCommit ++
          autoOffset ++ serializers ++ metaDataBrokerList ++ groupId ++ partitionStrategy ++ getCustomProperties)
        KafkaUtils.createDirectStream[String, Double](ssc, locationStrategy, consumerStrategy)
      case "bytebuffer" =>
        val consumerStrategy = ConsumerStrategies.Subscribe[String, ByteBuffer](topics, enableAutoCommit ++
          autoOffset ++ serializers ++ metaDataBrokerList ++ groupId ++ partitionStrategy ++ getCustomProperties)
        KafkaUtils.createDirectStream[String, ByteBuffer](ssc, locationStrategy, consumerStrategy)
      case "arraybyte" =>
        val consumerStrategy = ConsumerStrategies.Subscribe[String, Array[Byte]](topics, enableAutoCommit ++
          autoOffset ++ serializers ++ metaDataBrokerList ++ groupId ++ partitionStrategy ++ getCustomProperties)
        KafkaUtils.createDirectStream[String, Array[Byte]](ssc, locationStrategy, consumerStrategy)
      case "bytes" =>
        val consumerStrategy = ConsumerStrategies.Subscribe[String, Bytes](topics, enableAutoCommit ++
          autoOffset ++ serializers ++ metaDataBrokerList ++ groupId ++ partitionStrategy ++ getCustomProperties)
        KafkaUtils.createDirectStream[String, Bytes](ssc, locationStrategy, consumerStrategy)
      case _ =>
        val consumerStrategy = ConsumerStrategies.Subscribe[String, String](topics, enableAutoCommit ++
          autoOffset ++ serializers ++ metaDataBrokerList ++ groupId ++ partitionStrategy ++ getCustomProperties)
        KafkaUtils.createDirectStream[String, String](ssc, locationStrategy, consumerStrategy)
    }

    if (!enableAutoCommit.head._2 && getAutoCommitInKafka) {
      inputDStream.foreachRDD { rdd =>
        val offsetRanges = rdd.asInstanceOf[HasOffsetRanges].offsetRanges
        inputDStream.asInstanceOf[CanCommitOffsets].commitAsync(offsetRanges)
        log.info(s"Committed Kafka offsets --> ${
          offsetRanges.map(offset =>
            s"\tTopic: ${offset.topic}, Partition: ${offset.partition}, From: ${offset.fromOffset}, until: " +
              s"${offset.untilOffset}"
          ).mkString("\n")
        }")
      }
    }

    inputDStream.map(data => Row(data.value()))
  }

  //scalastyle:on

  /** SERIALIZERS **/

  def getSerializerByKey(serializerKey: String): Class[_ >: StringDeserializer with LongDeserializer
    with IntegerDeserializer with DoubleDeserializer with ByteArrayDeserializer with ByteBufferDeserializer
    with BytesDeserializer <: Deserializer[_ >: String with Long with Integer with Double with
    Array[Byte] with ByteBuffer with Bytes]] =
    serializerKey match {
      case "string" => classOf[StringDeserializer]
      case "long" => classOf[LongDeserializer]
      case "int" => classOf[IntegerDeserializer]
      case "double" => classOf[DoubleDeserializer]
      case "arraybyte" => classOf[ByteArrayDeserializer]
      case "bytebuffer" => classOf[ByteBufferDeserializer]
      case "bytes" => classOf[BytesDeserializer]
      case _ => classOf[StringDeserializer]
    }

  /** OFFSETS MANAGEMENT **/

  def getAutoOffset: Map[String, String] = {
    val autoOffsetResetKey = "auto.offset.reset"
    val autoOffsetResetValue = properties.getString(autoOffsetResetKey, "latest")

    Map(autoOffsetResetKey -> autoOffsetResetValue)
  }

  def getAutoCommit: Map[String, java.lang.Boolean] = {
    val autoCommitKey = "enable.auto.commit"
    val autoCommitValue = Try(properties.getBoolean(autoCommitKey)).getOrElse(false)

    Map(autoCommitKey -> autoCommitValue)
  }

  def getAutoCommitInKafka: Boolean =
    Try(properties.getBoolean("storeOffsetInKafka")).getOrElse(true)

  /** LOCATION STRATEGY **/

  def getLocationStrategy: LocationStrategy =
    properties.getString("locationStrategy", None) match {
      case Some(strategy) => strategy match {
        case "preferbrokers" => LocationStrategies.PreferBrokers
        case "preferconsistent" => LocationStrategies.PreferConsistent
        case _ => LocationStrategies.PreferConsistent
      }
      case None => LocationStrategies.PreferConsistent
    }

  /** PARTITION ASSIGMENT STRATEGY **/

  def getPartitionStrategy: Map[String, String] = {
    val partitionStrategyKey = "partition.assignment.strategy"
    val strategy = properties.getString("partition.assignment.strategy", None) match {
      case Some("range") => classOf[RangeAssignor].getCanonicalName
      case Some("roundrobin") => classOf[RoundRobinAssignor].getCanonicalName
      case None => classOf[RangeAssignor].getCanonicalName
    }

    Map(partitionStrategyKey -> strategy)
  }
}
