import { Button, Input } from 'antd';
import { useEffect, useState } from 'react';

const { TextArea } = Input;

export type ChatMessageType = {
    message: string
    photo: string
    userId: number
    userName: string
}

const ChatPage: React.FC = () => {
    return <div>
        <Chat />
    </div>
}

const Chat: React.FC = () => {
    const [wsChannel, setWsChannel] = useState<WebSocket | null>(null);

    useEffect(() => {
        let ws: WebSocket;
        const closeHandler = () => {
            console.log('WebSocket closed. Reconnecting...')
            setTimeout(createChannel, 3000);
        }
        function createChannel() {
            ws?.removeEventListener('close', closeHandler);
            ws?.close();
            ws = new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx');
            ws.addEventListener('close', closeHandler);
            setWsChannel(ws);
        }
        createChannel();

        return () => {
            ws.removeEventListener('close', closeHandler);
            ws.close();
        }
    }, []);

    useEffect(() => {
        wsChannel?.addEventListener('close', () => {
            console.log('WebSocket closed. Reconnecting...')
        })
    }, [wsChannel]);


    return <div>
        <Messages wsChannel={wsChannel} />
        <AddMessageForm wsChannel={wsChannel} />
    </div>
}

const Messages: React.FC<{ wsChannel: WebSocket | null }> = ({ wsChannel }) => {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);

    useEffect(() => {
        const messageHandler = (e: MessageEvent) => {
            const newMessages = JSON.parse(e.data);
            setMessages((prevMessages) => [...prevMessages, ...newMessages]);
        };
        wsChannel?.addEventListener('message', messageHandler);

        return () => {
            wsChannel?.removeEventListener('message', messageHandler)
        }
    }, [wsChannel]);

    return <div key="messages" style={{ height: '500px', overflowY: 'auto' }}>
        {messages.map((m, index) => <Message key={index} message={m} />)}
    </div>
}

const Message: React.FC<{ message: ChatMessageType }> = ({ message }) => {
    return <div>
        <img src={message.photo} width="50px" alt={message.userName} /><b>{message.userName}</b>
        <br />
        <span>{message.message}</span>
    </div>
}

const AddMessageForm: React.FC<{ wsChannel: WebSocket | null }> = ({ wsChannel }) => {
    const [message, setMessage] = useState('');
    const [readyStatus, setReadyStatus] = useState<'pending' | 'ready'>('pending');

    useEffect(() => {
        const openHandler = () => {
            setReadyStatus('ready');
        };
        wsChannel?.addEventListener('open', openHandler)
        return () => {
            wsChannel?.removeEventListener('open', openHandler)
        }
    }, [wsChannel]);


    const sendMessage = () => {
        if (!message) {
            return;
        }
        wsChannel?.send(message);
        setMessage('');
    }

    return <div>
        <div>
            <TextArea value={message} onChange={(e) => setMessage(e.currentTarget.value)} placeholder="Type your message here..." />
        </div>
        <div>
            <Button disabled={wsChannel === null || readyStatus !== 'ready'} onClick={sendMessage}>Send</Button>
        </div>
    </div>
}

export default ChatPage;