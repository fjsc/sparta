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
package com.stratio.sparkta.serving.api.ssl

import java.io.FileInputStream
import java.security.{KeyStore, SecureRandom}
import javax.net.ssl.{KeyManagerFactory, SSLContext, TrustManagerFactory}

import com.stratio.sparta.serving.api.helpers.SpartaHelper.log
import com.stratio.sparta.serving.core.config.SpartaConfig
import spray.io._

import scala.util.{Failure, Success, Try}

trait SSLSupport {

  implicit def sslContext: SSLContext = {
    val context = SSLContext.getInstance("TLS")
    if(isHttpsEnabled) {
      val keyStoreResource = SpartaConfig.apiConfig.get.getString("certificate-file")
      val password = SpartaConfig.apiConfig.get.getString("certificate-password")

      val keyStore = KeyStore.getInstance("jks")
      keyStore.load(new FileInputStream(keyStoreResource), password.toCharArray)
      val keyManagerFactory = KeyManagerFactory.getInstance("SunX509")
      keyManagerFactory.init(keyStore, password.toCharArray)
      val trustManagerFactory = TrustManagerFactory.getInstance("SunX509")
      trustManagerFactory.init(keyStore)
      context.init(keyManagerFactory.getKeyManagers, trustManagerFactory.getTrustManagers, new SecureRandom)
    }
    context
  }

  implicit def sslEngineProvider: ServerSSLEngineProvider = {
    ServerSSLEngineProvider { engine =>
      engine.setEnabledCipherSuites(Array("TLS_RSA_WITH_AES_128_CBC_SHA"))
      engine.setEnabledProtocols(Array( "TLSv1.2" ))
      engine
    }
  }

  def isHttpsEnabled: Boolean =
    SpartaConfig.getSprayConfig match {
      case Some(config) =>
        Try(config.getValue("ssl-encryption")) match {
          case Success(value) =>
            "on".equals(value.unwrapped())
          case Failure(e) =>
            log.error("Incorrect value in ssl-encryption option, setting https disabled", e)
            false
        }
      case None =>
        log.warn("Impossible to get spray config, setting https disabled")
        false
    }
}
