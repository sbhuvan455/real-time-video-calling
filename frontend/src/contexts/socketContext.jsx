import { createContext, useContext, useEffect, useState } from "react";


const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}

export const SocketProvider = (props) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");

        // ws.onerror(err => console.error(err));
        ws.onerror = (error) => {
            console.log(error)
        }


        ws.onopen = () => {
            setSocket(ws);
        }

        return () => {
            ws.close();
        }

    }, [])

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}