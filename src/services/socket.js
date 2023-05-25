import { io } from 'socket.io-client';

const WS_URL = 'ws://localhost:8080/';

export const socket = io(WS_URL);