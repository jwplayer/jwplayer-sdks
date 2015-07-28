#!/bin/bash
# This is a simple script that compiles the plugin using the free Flex SDK on Linux/Mac.

FLEXPATH=/Developer/SDKs/flex_sdk_4.6

echo "Compiling Media Provider..."

$FLEXPATH/bin/mxmlc ../src/MyMediaProvider.as -sp ../src/ -o ../MyMediaProvider.swf -external-library-path+=../lib -static-link-runtime-shared-libraries=true -use-network=false
