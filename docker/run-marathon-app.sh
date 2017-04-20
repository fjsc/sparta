#!/bin/bash

# If a specific java binary isn't specified search for the standard 'java' binary
if [ -z "$JAVACMD" ] ; then
  if [ -n "$JAVA_HOME"  ] ; then
    if [ -x "$JAVA_HOME/jre/sh/java" ] ; then
      # IBM's JDK on AIX uses strange locations for the executables
      JAVACMD="$JAVA_HOME/jre/sh/java"
    else
      JAVACMD="$JAVA_HOME/bin/java"
    fi
  else
    JAVACMD=`which java`
  fi
fi

if [ ! -x "$JAVACMD" ] ; then
  echo "Error: JAVA_HOME is not defined correctly." 1>&2
  echo "  We cannot execute $JAVACMD" 1>&2
  exit 1
fi

if [ -z "$REPO" ]
then
  REPO="$SPARTA_HOME"/driver
fi

CLASSPATH="$SPARTA_HOME"/:/etc/sds/sparta:"$SPARTA_MARATHON_JAR"

SPARTA_MARATHON_OPTIONS="$MARATHON_APP_HEAP_MINIMUM_SIZE $MARATHON_APP_HEAP_SIZE"

if [ -v SPARTA_CONFIG_JAAS_FILE ] && [ ${#SPARTA_CONFIG_JAAS_FILE} != 0 ]; then
    SPARTA_MARATHON_OPTIONS="$SPARTA_MARATHON_OPTIONS $SPARTA_CONFIG_JAAS_FILE"
fi

exec "$JAVACMD" $SPARTA_MARATHON_OPTIONS \
  -classpath "$CLASSPATH" \
  -Dapp.name="run-marathon" \
  -Dapp.pid="$$" \
  -Dapp.repo="$REPO" \
  -Dapp.home="$SPARTA_HOME" \
  -Dbasedir="$SPARTA_HOME" \
  "$SPARTA_MARATHON_MAIN_CLASS" \
  "$SPARTA_POLICY_ID" "$SPARTA_ZOOKEEPER_CONFIG" "$SPARTA_DETAIL_CONFIG"
