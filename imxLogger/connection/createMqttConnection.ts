import mqtt, { IMqttClient, QoS } from "sp-react-native-mqtt";

import { mqttConnectionTypes } from "../types/mqttConnectionType";

import { IMqttClientOptions } from "../types/connectionOptionsType";

import { messagePayloadASArg } from "../types/messagePayloadASArg";

import tryStringifyJSONObject from "../helpers/tryStringifyJSONObject";

const LOGGER = (function () {
  let mqttConnection: mqttConnectionTypes | null = null;

  let isErrorLogginEnabled = true;

  let isDebugLogginEnabled = true;

  let topicName: string = "";

  let app_name: string = "N/A";

  return {
    async createMqttConnection(
      option: IMqttClientOptions,
      topic: string,
      appName?: string,
      extraOptions?: {
        enableError: boolean;
        enableDebug: boolean;
      },
      callBacks?: {
        onCloseCallBack?: () => void;
        onErrorCallBack?: (msg: string) => void;
        onConnectCallBack?: () => void;
        onMessageCallBack?: (msg: {
          data: string;
          qos: QoS;
          retain: boolean;
          topic: string;
        }) => void;
      }
    ): Promise<mqttConnectionTypes> {
      try {
        isErrorLogginEnabled = extraOptions?.enableError ?? true;

        isDebugLogginEnabled = extraOptions?.enableDebug ?? true;

        app_name = appName || "N/A";

        topicName = topic || "logs";

        const conn: IMqttClient = await mqtt?.createClient(option);

        conn.on("closed", function () {
          callBacks?.onCloseCallBack && callBacks?.onCloseCallBack();
        });

        conn.on("error", function (msg) {
          callBacks?.onErrorCallBack && callBacks?.onErrorCallBack(msg);
        });

        conn.on("connect", function () {
          callBacks?.onConnectCallBack && callBacks?.onConnectCallBack();
        });

        conn.on("message", function (msg) {
          callBacks?.onMessageCallBack && callBacks?.onMessageCallBack(msg);
        });

        mqttConnection = {
          connection: conn,
          setAppName(appName: string) {
            app_name = appName;
          },
          enableErrorLogging() {
            isErrorLogginEnabled = true;
          },
          disableErrorLogging() {
            isErrorLogginEnabled = false;
          },
          checkErrorLoggingStatus() {
            return isErrorLogginEnabled;
          },

          enableDebugLogging() {
            isDebugLogginEnabled = true;
          },
          disableDebugLogging() {
            isDebugLogginEnabled = false;
          },
          checkDebugLoggingStatus() {
            return isDebugLogginEnabled;
          },

          checkIsEnaled() {
            return {
              errorLoggingStatus: isErrorLogginEnabled,
              debugLoggingStatus: isDebugLogginEnabled,
            };
          },

          error(payload) {
            if (!isErrorLogginEnabled) return;
            conn?.publish(
              topicName,
              tryStringifyJSONObject({
                payload: {
                  ...payload,
                  date: new Date(),
                  level: "errors",
                  appName: app_name,
                },
              }),
              1,
              true
            );
          },

          debug(payload: messagePayloadASArg) {
            if (!isDebugLogginEnabled) return;
            conn?.publish(
              topicName,
              tryStringifyJSONObject({
                payload: {
                  ...payload,
                  date: new Date(),
                  level: "debug",
                  appName: app_name,
                },
              }),
              1,
              true
            );
          },

          connect() {
            conn?.connect();
          },

          disconnect() {
            conn?.disconnect();
          },
        };

        return mqttConnection;
      } catch (error) {
        console.error("Erreur in createMqttConnection :  ", error);
        return error;
      }
    },

    getMqttConnection() {
      return mqttConnection;
    },

    error(payload: messagePayloadASArg) {
      if (!isErrorLogginEnabled) return;
      mqttConnection?.error(payload);
    },

    debug(payload: messagePayloadASArg) {
      if (!isDebugLogginEnabled) return;
      mqttConnection?.debug(payload);
    },
    setAppName(appName: string) {
      mqttConnection?.setAppName(appName);
    },
    connect() {
      mqttConnection?.connect();
    },

    disconnect() {
      mqttConnection?.disconnect();
    },

    isConnected(): Promise<boolean> | undefined {
      return mqttConnection?.connection?.isConnected();
    },

    reconnect() {
      mqttConnection?.connection?.reconnect();
    },

    enableErrorLogging() {
      isErrorLogginEnabled = true;
    },
    disableErrorLogging() {
      isErrorLogginEnabled = false;
    },
    checkErrorLoggingStatus() {
      return isErrorLogginEnabled;
    },

    enableDebugLogging() {
      isDebugLogginEnabled = true;
    },
    disableDebugLogging() {
      isDebugLogginEnabled = false;
    },
    checkDebugLoggingStatus() {
      return isDebugLogginEnabled;
    },

    on(
      event: "message",
      cb: (msg: {
        data: string;
        qos: QoS;
        retain: boolean;
        topic: string;
      }) => void
    ) {
      mqttConnection?.connection?.on(event, cb);
    },
  };
})();

export default LOGGER;
