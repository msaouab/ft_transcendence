


import { Injectable } from "@nestjs/common";

import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,

} from "@nestjs/websockets";


import { Server, Socket } from "socket.io";
import { SearchService } from "./search.service";


// import { ChatService } from "./

@Injectable()
@WebSocketGateway({
    namespace: 'search',
    // cors: true,
})
export class SearchGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;
    constructor(private SearchService: SearchService) { }


    handleConnection(client: Socket) {
        const { id } = client;
        console.log(`Client with id ${id} connected to search namespace`);
    }

    handleDisconnect(client: Socket) {
        const { id } = client;
        console.log(`Client with id ${id} disconnected`);
    }

    @SubscribeMessage('search')
    async handleSearch(client: Socket, payload: {
        search: string,
        limit: number,
    }) {
        console.log("We've got the event it's: ", payload.search);
        const result = await this.SearchService.search(payload.search, payload.limit);
        console.log("The result is: ", result);
        client.emit('searchInfo', result);


    }


}



