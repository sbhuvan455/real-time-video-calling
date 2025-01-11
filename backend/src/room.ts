import { WebSocket } from "ws";
import { Answer, Message, Offer, SendAnswer, SendOffer } from "./types";

export class Room{
    public name: string;
    private user1: WebSocket;
    private user2: WebSocket;

    constructor(name: string, user1: WebSocket, user2:WebSocket){
        this.name = name;
        this.user1 = user1;
        this.user2 = user2;

        this.socketListeners(this.user1);
        this.socketListeners(this.user2);
    }

    private socketListeners = (user: WebSocket): void => {
        user.on('message', (data: Message) => {
            const message = JSON.parse(data.toString());

            switch(message.type){
                case SendOffer:
                    if(user === this.user1){
                        this.user2.send(JSON.stringify({
                            type: Offer,
                            payload: message.payload
                        }))
                    }else{
                        this.user1.send(JSON.stringify({
                            type: Offer,
                            payload: message.payload
                        }))
                    }
                case SendAnswer:
                    if(user === this.user1){
                        this.user2.send(JSON.stringify({
                            type: Answer,
                            payload: message.payload
                        }))
                    }else{
                        this.user1.send(JSON.stringify({
                            type: Answer,
                            payload: message.payload
                        }))
                    }
            }
        })
    }
}