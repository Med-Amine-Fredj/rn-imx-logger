# IMX LOGGER FOR REACT NATIVE APP

![](https://imaxeam.com/assets/images/logo-dark.png)

### Installation

#### Step1

```
yarn add rn-imx-logger sp-react-native-mqtt
```

or 

```
npm install  rn-imx-logger sp-react-native-mqtt --save
```

#### Step 2

under android/app/build.gradle add this lines of code : 

```
android {
    configurations{
        all*.exclude module: 'conceal'
        all*.exclude module: 'bcprov-jdk15on'
  }
    //The rest of the android code 
}
```

### Usage

```
import { imxRNLogger } from "rn-imx-logger";

const option = {
      clientId: new Date().getTime().toString(),
      uri: "mqtt://localhost:1883", 
      tls: false,
      auth: true,
      user: "user",
      pass: "password",
 };


const topicName = "logs"

const appName= "example_app_name"

const loggingStatus = {
    enableDebug: true, 
    enableError: true 
}

const callBacks = {
     onConnectCallBack: () => console.log("Connected"),
        onCloseCallBack() {
          console.log("Diconnected");
        },

      onErrorCallBack:(msg) => console.log("error ", msg),

      onMessageCallBack(msg) {
          console.log("message ", msg);
        },
}
  useEffect(() => {
   imxRNLogger.createMqttConnection(option,topicName,appName,loggingStatus,callBacks   );
    return () => {
      imxLogger.disconnect()
    };
  }, []);

// send DEBUG logs 
 imxRNLogger.debug({
      appName: "app_example",
      context: "context_example1",
      message: "message_example",
      user?: "user_example",
      extra?: any
  })

// send ERROR logs 
 imxRNLogger.error({
      appName: "app_example",
      context: "context_example1",
      message: "message_example",
      user?: "user_example",
      extra?: any
  })

//getMqttConnection
imxRNLogger.getMqttConnection()

//connect
imxRNLogger.connect()


//Disconnect 
imxRNLogger.disconnect()


//Set app name 
imxRNLogger.setAppName("Hello world !")

// Check is Connected
imxRNLogger.isConnected()


//Reconnect 
imxRNLogger.reconnect()


//Enable DEBUG  logging 
imxRNLogger.enableDebugLogging()

//Enable ERRORS logging 
imxRNLogger.enableErrorLogging()


// Disable DEBUG  Logging 
 imxRNLogger.disableDebugLogging()

// Disable ERROR Logging 
 imxRNLogger.disableErrorLogging()

// Check Error logging status
 imxRNLogger.checkErrorLoggingStatus()

// Check DEBUG logging status
 imxRNLogger.checkDebugLoggingStatus()

// check Logging enable or not 
 imxRNLogger.checkIsEnaled() // return {
                //  errorLoggingStatus: bool,
               //  debugLoggingStatus: bool,
              //       }
```

### API

- `createClient(options, onCloseCallBack,onErrorCallBack,onMessageCallBack,onConnectCallBack)` create new client instance with `options`, async operation
  
  - `uri`: `protocol://host:port`, protocol is [mqtt | mqtts]
  - `host`: ipaddress or host name (override by uri if set)
  - `port`: port number (override by uri if set)
  - `tls`: true/false (override by uri if set to mqtts or wss)
  - `user`: string username
  - `pass`: string password
  - `auth`: true/false - override = true Set to true if `user` or `pass` exist
  - `clientId`: string client id
  - `keepalive`

- `connect()` connect from the connection created to MQTT

- `disconnect()` disconnect from the connection created to MQTT

- `getMqttConnection()` get all the connectionObject

- `debug({message: string, context: string,appName: string, user?: string})` : send logs as DEBUG 

- `error({message: string, context: string,appName: string, user?: string})` : send logs as ERROR

- `isConnected()` return Boolean 

- `reconnect()` reconnect from the connection created to MQTT

- `on(event, callback)`: add event listener for
  
  - event: `connect` - client connected
  - event: `closed` - client disconnected
  - event: `error` - error
  - event: `message` - message object

- `enableErrorLogging()`  to enable error logging

- `enableDebugLogging()` to enable debuglogging 

- `disableErrorLogging()`  to disable error logging

- `disableDebugLogging()` to disable  debug logging

- `checkDebugLoggingStatus()` to check the debug logging status

- `checkErrorLoggingStatus()` to check the error logging status 

- `checkIsEnaled()` to check the logging status of error and debug 

- `setAppName()` to set the app name sending in logs
