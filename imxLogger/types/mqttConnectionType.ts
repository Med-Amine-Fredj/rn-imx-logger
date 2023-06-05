import { IMqttClient } from "sp-react-native-mqtt";
import { messagePayloadASArg } from "./messagePayloadASArg";

type loggingStatus = {
  errorLoggingStatus: boolean;
  debugLoggingStatus: boolean;
};

export type mqttConnectionTypes = {
  connection: IMqttClient | null;
  setAppName(app_name: string): void;
  enableErrorLogging(): void;
  disableErrorLogging(): void;
  checkErrorLoggingStatus(): boolean;
  enableDebugLogging(): void;
  disableDebugLogging(): void;
  checkDebugLoggingStatus(): boolean;
  checkIsEnaled(): loggingStatus;
  error(payload: messagePayloadASArg): void;
  debug(payload: messagePayloadASArg): void;
  connect(): void;
  disconnect(): void;
};
