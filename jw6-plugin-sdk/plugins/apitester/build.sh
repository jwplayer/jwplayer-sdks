#!/bin/bash
# This is a simple script that compiles the plugin using the free Flex SDK on Linux/Mac.

FLEXPATH=/Developer/SDKs/flex_sdk_4

echo "Compiling JW6 Plugin..."

$FLEXPATH/bin/mxmlc ./APITester.as -sp ./ -o ./apitester.swf -external-library-path+=../../libs -static-link-runtime-shared-libraries=true -use-network=false
