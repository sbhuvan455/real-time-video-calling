import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSocket } from '../contexts/socketContext';
import { Answer, CreateRoom, Offer, RoomCreated, SendAnswer, SendOffer } from '../types';
import { useState } from 'react';
import { usePeerContext } from '../contexts/peerContext';

function Room() {

    const [waiting, setWaiting] = useState(true);
    const { peer, createOffer } = usePeerContext();

    const { room } = useParams();
    const socket = useSocket();

    const createAnswer = async (offer) => {
        await peer.setRemoteDescription(offer)
        const answer = await peer.createAnswer(offer);
        await peer.setLocalDescription(answer);
        return answer;
    }

    const storeAnswer = async (answer) => {
        await peer.setRemoteDescription(answer);
    }

    const handleMessage = (data) => {
        // console.log(data)
        const message = JSON.parse(data.data);

        console.log("Hello How are you?");

        switch(message.type){
            case RoomCreated:
                setWaiting(false);
                if(message.payload.canSendOffer){
                    const offer = createOffer();
                    socket.send(JSON.stringify({
                        type: SendOffer,
                        payload: offer
                    }))
                }
            case Offer:
                const answer = createAnswer(message.payload);
                socket.send(JSON.stringify({
                    type: SendAnswer,
                    payload: answer
                }))
            case Answer:
                storeAnswer(message.payload);
        }
    }

    useEffect(() => {

        if(socket){
            console.log(socket)

            socket.send(JSON.stringify({
                type: CreateRoom,
                payload: {
                    room
                }
            }))
    
            socket.onmessage = (data) => handleMessage(data);

            return () => {
                document.removeEventListener('message', handleMessage)
            };
        } 

    }, [room, socket]);

    if(waiting) {
        console.log(waiting);
        return (
            <div>
                Waiting for the other user to join the room
            </div>
        )
    }

    return (
        <div>
            {room}
        </div>
    )
}

export default Room
