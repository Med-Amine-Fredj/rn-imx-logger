export type IMqttClientOptions = {
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
};
export type QoS = 0 | 1 | 2;
