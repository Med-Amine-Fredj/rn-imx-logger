import mqtt, { IMqttClient } from "sp-react-native-mqtt";

export type QoS = 0 | 1 | 2;

interface IMqttClientOptions {
  clientId: string;
  uri: string;
  host?: string;
  port?: number;
  protocol?: "mqtt" | "tcp" | "wss" | "mqtts" | "ws";
  tls?: boolean;
  keepalive?: number; // seconds
  protocolLevel?: number;
  clean?: boolean;
  auth?: boolean;
  user?: string; // only used when auth is true
  pass?: string; // only used when auth is true
  will?: boolean;
  willMsg?: string; // only used when will is true
  willtopic?: string; // only used when will is true
  willQos?: QoS; // only used when will is true
  willRetainFlag?: boolean; // only used when will is true
  automaticReconnect?: boolean; // android only
}

type messagePayloadToMqTTType = {
  level: "errors" | "debug";
  message: string;
  context: string;
  appName: string;
  user?: string;
};

type messagePayloadToMqTTFromUsers = {
  message: string;
  context: string;
  appName: string;
  user?: string;
};

type mqttConnectionTypes = {
  connection: IMqttClient | null;
  enableLogging(): void;
  disableLogging(): void;
  checkIsEnaled(): boolean;
  error(payload: messagePayloadToMqTTFromUsers): void;
  debug(payload: messagePayloadToMqTTFromUsers): void;
  connect(): void;
  disconnect(): void;
};

const LOGGER = (function () {
  let mqttConnection: mqttConnectionTypes | null = null;

  let isEnabled = true;

  let topicName: string = "";

  return {
    async createMqttConnection(
      option: IMqttClientOptions,
      topic: string,
      enable?: boolean,
      onCloseCallBack?: () => void,
      onErrorCallBack?: (msg: string) => void,
      onConnectCallBack?: () => void,
      onMessageCallBack?: (msg: {
        data: string;
        qos: QoS;
        retain: boolean;
        topic: string;
      }) => void
    ): Promise<mqttConnectionTypes> {
      try {
        isEnabled = enable ?? true;

        topicName = topic || "logs";

        const conn: IMqttClient = await mqtt?.createClient(option);

        conn.on("closed", function () {
          onCloseCallBack && onCloseCallBack();
        });

        conn.on("error", function (msg) {
          onErrorCallBack && onErrorCallBack(msg);
        });

        conn.on("connect", function () {
          onConnectCallBack && onConnectCallBack();
        });

        conn.on("message", function (msg) {
          onMessageCallBack && onMessageCallBack(msg);
        });

        mqttConnection = {
          connection: conn,
          enableLogging() {
            isEnabled = true;
          },

          disableLogging() {
            isEnabled = false;
          },

          checkIsEnaled() {
            return isEnabled;
          },

          error(payload) {
            if (!isEnabled) return;
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
            if (!isEnabled) return;
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
      if (!isEnabled) return;
      mqttConnection?.error(payload);
    },

    debug(payload: messagePayloadToMqTTFromUsers) {
      if (!isEnabled) return;
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

    enableLogging() {
      isEnabled = true;
    },

    checkIsEnaled() {
      return isEnabled;
    },

    disableLogging() {
      isEnabled = false;
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
