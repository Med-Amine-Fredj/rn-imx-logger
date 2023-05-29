import { IMqttClient } from "sp-react-native-mqtt";
import { messagePayloadToMqTTFromUsers } from "./messagePayload";

type loggingStatus = {
  errorLoggingStatus: boolean;
  debugLoggingStatus: boolean;
};

export type mqttConnectionTypes = {
  connection: IMqttClient | null;
  enableErrorLogging(): void;
  disableErrorLogging(): void;
  checkErrorLoggingStatus(): boolean;
  enableDebugLogging(): void;
  disableDebugLogging(): void;
  checkDebugLoggingStatus(): boolean;
  checkIsEnaled(): loggingStatus;
  error(payload: messagePayloadToMqTTFromUsers): void;
  debug(payload: messagePayloadToMqTTFromUsers): void;
  connect(): void;
  disconnect(): void;
};
