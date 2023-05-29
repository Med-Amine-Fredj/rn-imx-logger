import mqtt, { IMqttClient, QoS } from "sp-react-native-mqtt";

import { mqttConnectionTypes } from "../types/mqttConnectionType";

import { IMqttClientOptions } from "../types/connectionOptionsType";

import { messagePayloadToMqTTFromUsers } from "../types/messagePayload";

const LOGGER = (function () {
  let mqttConnection: mqttConnectionTypes | null = null;

  let isErrorLogginEnabled = true;

  let isDebugLogginEnabled = true;

  let topicName: string = "";

  return {
    async createMqttConnection(
      option: IMqttClientOptions,
      topic: string,
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
              JSON?.stringify({
                payload: { ...payload, date: new Date(), level: "errors" },
              }),
              1,
              true
            );
          },

          debug(payload: messagePayloadToMqTTFromUsers) {
            if (!isDebugLogginEnabled) return;
            conn?.publish(
              topicName,
              JSON?.stringify({
                payload: { ...payload, date: new Date(), level: "debug" },
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

    error(payload: messagePayloadToMqTTFromUsers) {
      if (!isErrorLogginEnabled) return;
      mqttConnection?.error(payload);
    },

    debug(payload: messagePayloadToMqTTFromUsers) {
      if (!isDebugLogginEnabled) return;
      mqttConnection?.debug(payload);
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
