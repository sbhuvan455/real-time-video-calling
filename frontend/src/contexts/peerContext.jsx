import { createContext, useContext, useMemo } from "react";


export const PeerContext = createContext(null);

export const usePeerContext = () => useContext(PeerContext)


export const PeerProvider = (props) => {

    const peer = useMemo(() => new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302"
                ],
            },
        ]
    }), []);

    const createOffer = async () => {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    }

    return (
        <PeerContext.Provider value={{peer, createOffer}}>
            {props.children}
        </PeerContext.Provider>
    )
}