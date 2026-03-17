import { io } from "socket.io-client";
import ApplicationConstants from "../constants/ApplicationConstants";

const socketPath = ApplicationConstants.WEBSOCKET_PATH;

export const socket = io(socketPath);
