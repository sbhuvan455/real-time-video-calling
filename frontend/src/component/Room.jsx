import React, { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSocket } from '../contexts/socketContext';
import { Answer, CreateRoom, Offer, RoomCreated, SendAnswer, SendOffer } from '../types';
import { useState } from 'react';
import { usePeerContext } from '../contexts/peerContext';
import ReactPlayer from 'react-player'

function Room() {

    const [waiting, setWaiting] = useState(true);
    const [myStream, setMyStream] = useState(null);
    const { peer, createOffer } = usePeerContext();
    const [remoteStream, setRemoteStream] = useState();

    const { room } = useParams();
    const socket = useSocket();

    const createAnswer = async (offer) => {
        await peer.setRemoteDescription(offer)
        const answer = await peer.createAnswer(offer);
        await peer.setLocalDescription(answer);
        return answer;
    }

    const startCall = useCallback(() => {
        console.log("Inside startCall", myStream);
        for (const tracks of myStream.getTracks()){
            peer.peer.addTrack(tracks, myStream);
        }
    }, [myStream])

    const storeAnswer = async (answer) => {
        await peer.setRemoteDescription(answer);

        startCall();
    }

    const handleMessage = async (data) => {
        // console.log(data)
        const message = JSON.parse(data.data);

        console.log("Hello How are you?");

        switch(message.type){
            case RoomCreated:
                setWaiting(false);
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                })

                setMyStream(stream);

                if(message.payload.canSendOffer){
                    const offer = await createOffer();
                    console.log("Have created a new offer", offer);
                    socket.send(JSON.stringify({
                        type: SendOffer,
                        payload: offer
                    }))
                }

                break;
            case Offer:
                const answer = await createAnswer(message.payload);
                socket.send(JSON.stringify({
                    type: SendAnswer,
                    payload: answer
                }))
                break;
            case Answer:
                storeAnswer(message.payload);
                break;
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

    useEffect(() => {
        const handleTrack = async (event) => {
            const [stream] = event.streams;
            setRemoteStream((prev) => prev || stream);
        };
    
        peer?.peer?.addEventListener("track", handleTrack);
    
        return () => {
            peer?.peer?.removeEventListener("track", handleTrack);
        };
    }, [peer]);
    

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
            {(myStream) && 
            <ReactPlayer 
                width={800} 
                height={800} 
                playsinline 
                playing={true}
                url={myStream}
            />
            }
            {(remoteStream) && 
                <ReactPlayer
                    width={300}
                    height={300}
                    playsinline
                    playing={true}
                    url={remoteStream}
                />
            }
        </div>
    )
}

export default Room
