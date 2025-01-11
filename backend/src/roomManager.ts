import { WebSocket } from "ws";
import { CreateRoom, Message, RoomCreated } from "./types";
// import { Room } from "./room";
import { Room } from "./room";

export class RoomManager{
    private RoomToUser = new Map<string, WebSocket>();
    private Users = new Array<WebSocket>();
    private rooms = new Array<Room>();
    // UserToEmail = new Map<WebSocket, string>();


    constructor(){
        this.RoomToUser = new Map<string, WebSocket>();
        // this.UserToEmail = new Map<WebSocket, string>();
    }

    public addUser = (user: WebSocket): void => {
        this.Users.push(user);
        console.log("Hello A user Joined!");
        this.attachListeners(user);
    }

    private attachListeners = (user: WebSocket): void => {
        user.on("message", (data: Message) => {

            const message = JSON.parse(data.toString());

            switch(message.type){
                case CreateRoom:
                    console.log("User asked tpo create a room");
                    const existingUser: WebSocket | undefined = this.RoomToUser.get(message.payload.room);

                    if(existingUser){
                        const room = new Room(message.payload.room, existingUser, user);
                        this.rooms.push(room);
                        this.RoomToUser.delete(message.payload.room);

                        existingUser.send(JSON.stringify({
                            type: RoomCreated,
                            payload: {
                                canSendOffer: true
                            }
                        }))

                        user.send(JSON.stringify({
                            type: RoomCreated,
                            payload: {
                                canSendOffer: false
                            }
                        }))
                        
                    }else{
                        this.RoomToUser.set(message.payload.room, user);
                    }
            }
        })
    }
}