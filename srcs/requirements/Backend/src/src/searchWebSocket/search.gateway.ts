


import { Injectable } from "@nestjs/common";

import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,

} from "@nestjs/websockets";


import { Server, Socket } from "socket.io";
import { SearchService } from "./search.service";



@Injectable()
@WebSocketGateway({
    namespace: 'search',
})
export class SearchGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;
    constructor(private SearchService: SearchService) { }


    handleConnection(client: Socket) {
        const { id } = client;
    }

    handleDisconnect(client: Socket) {
        const { id } = client;
    }

    @SubscribeMessage('search')
    async handleSearch(client: Socket, payload: {
        search: string,
        limit: number,
        user_id: string,
    }) {
        // console.log("We've got the event it's: ", payload.search);
        const result = await this.SearchService.searchWebSocket(payload.search, payload.limit, payload.user_id);
        // console.log("The result is: ", result);
        client.emit('searchInfo', result);


    }


}



