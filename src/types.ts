export interface Message {
    type: string;
    payload?: any;
}

export const CreateRoom = "create-room";