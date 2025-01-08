import { WebSocketServer } from 'ws';
import { RoomManager } from './roomManager';

const wss = new WebSocketServer({ port: 8080 });

const Manager = new RoomManager();

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  Manager.addUser(ws);
});