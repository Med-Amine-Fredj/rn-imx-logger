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

const LOGGER = (function () {
  let mqttConnection: IMqttClient | null = null;

  return {
    async createMqttConnection(
      option: IMqttClientOptions,
      onCloseCallBack?: Function,
      onErrorCallBack?: Function,
      onMessageCallBack?: Function,
      onConnectCallBack?: Function
    ): Promise<IMqttClient> {
      try {
        const conn = await mqtt?.createClient(option);

        conn.on("closed", function () {
          onCloseCallBack && onCloseCallBack();
        });

        conn.on("error", function (msg) {
          onErrorCallBack && onErrorCallBack();
        });

        conn.on("message", function (msg) {
          onMessageCallBack && onMessageCallBack();
        });
        conn.on("connect", function () {
          onConnectCallBack && onConnectCallBack();
        });

        mqttConnection = conn;

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
      mqttConnection?.publish(
        "logs",
        JSON?.stringify({
          payload: { ...payload, date: new Date(), level: "errors" },
        }),
        1,
        true
      );
    },

    debug(payload: messagePayloadToMqTTFromUsers) {
      if (!mqttConnection) {
        console.warn(
          "Make sure you created the MQTT connection successfully !"
        );
        return;
      }
      mqttConnection.publish(
        "logs",
        JSON?.stringify({
          payload: { ...payload, date: new Date(), level: "debug" },
        }),
        1,
        true
      );
    },

    connect() {
      if (!mqttConnection) {
        console.warn(
          "Make sure you created the MQTT connection successfully !"
        );
        return;
      }
      mqttConnection?.connect();
    },

    disconnect() {
      if (!mqttConnection) {
        console.warn(
          "Make sure you created the MQTT connection successfully !"
        );
        return;
      }
      mqttConnection?.disconnect();
    },

    isConnected(): Promise<boolean> | undefined {
      if (!mqttConnection) {
        console.warn(
          "Make sure you created the MQTT connection successfully !"
        );
        return;
      }
      mqttConnection?.isConnected();
    },

    reconnect() {
      if (!mqttConnection) {
        console.warn(
          "Make sure you created the MQTT connection successfully !"
        );
        return;
      }
      mqttConnection?.reconnect();
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
      if (!mqttConnection) {
        console.warn(
          "Make sure you created the MQTT connection successfully !"
        );
        return;
      }
      mqttConnection?.on(event, cb);
    },
  };
})();

export default LOGGER;
