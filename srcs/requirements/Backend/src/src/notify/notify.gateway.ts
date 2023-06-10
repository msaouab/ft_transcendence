import { HttpException, Injectable } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { NotificationService } from "./notify.service";
// import { NotificationService } from './notifications.service';
import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";

export const clients = new Map<string, Socket>();
@Injectable()
@WebSocketGateway({ namespace: "/" })
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private notificationService: NotificationService) {}
  // private clients  = new Map<string, Socket>();
  @SubscribeMessage("realStatus")
  async handleStatus(
    client: Socket,
    payload: {
      id: string;
      userStatus: boolean;
    }
  ) {
    const { id, userStatus } = payload;
    clients.set(id, client);
    // console.log("clients: ", clients.keys());
    await this.notificationService.updateUserStatus(id, userStatus);
  }

  handleConnection(client: Socket) {
    const { id } = client;
    console.log(`Client with id ${id} connected to root namespace`);
  }

  async handleDisconnect(client: Socket) {
    const { id } = client;
    console.log(`Client with id ${id} disconnected`);
    const user = [...clients.entries()].find(({ 1: v }) => v.id === client.id);
    if (user) {
      const key = user[0] === undefined ? "" : user[0];
      clients.delete(key);
      await this.notificationService.updateUserStatus(key, false);
    }
  }
}
