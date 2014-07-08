::  This is a simple script that compiles the plugin using the free Flex SDK on Linux/Mac.

SET FLEXPATH="C:\Program Files\flex_sdk_3"

echo "Compiling JW6 Plugin..."

%FLEXPATH%\bin\mxmlc .\APITester.as -sp .\ -o .\apitester.swf -external-library-path+=..\..\libs -use-network=false -static-link-runtime-shared-libraries=true