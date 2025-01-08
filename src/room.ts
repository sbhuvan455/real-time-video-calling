import { WebSocket } from "ws";

export class Room{
    public name: string;
    private user1: WebSocket;
    private user2: WebSocket;

    constructor(name: string, user1: WebSocket, user2:WebSocket){
        this.name = name;
        this.user1 = user1;
        this.user2 = user2;
    }


}