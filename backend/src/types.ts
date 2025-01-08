export interface Message {
    type: string;
    payload?: any;
}

export const CreateRoom = "create-room";
export const RoomCreated = "room-created";
export const SendOffer = "send-offer";
export const Offer = 'offer';