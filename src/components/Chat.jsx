import { useState, useEffect, useRef } from "react";
import { db } from "../firebase/config";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";
import { useAuthValue } from "../context/AuthContext";
import styles from "./Chat.module.css";

const Chat = ({ otherUser }) => {
    const { user } = useAuthValue();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    console.log("uid atual:", user?.uid);
    console.log("UID do outro usuário:", otherUser?.uid);


    const chatId = [user.uid, otherUser.uid].sort().join('_');
    
    useEffect(() => {
        const q = query(
            collection(db, 'chats', chatId, 'messages'),
            orderBy('timestamp')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = [];
            querySnapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() });
            });
            console.log("Mensagens recebidas do firestore:", msgs);
            setMessages(msgs);
            scrollToBottom();
        });

        return () => unsubscribe();
    }, [chatId]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        await addDoc(collection(db, 'chats', chatId, 'messages'), {
            text: newMessage,
            senderId: user.uid,
            senderName: user.displayName || user.email,
            timestamp: serverTimestamp(),
        });

        setNewMessage('');
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <div className={styles.chatContainer}>
            <h3>Chat com {otherUser.displayName || otherUser.email}</h3>
            <div className={styles.messages}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`${styles.message} ${msg.senderId === user.uid ? styles.sent : styles.received}`}
                    >
                        <span className={styles.sender}>{msg.senderName}</span>
                        <p>{msg.text}</p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={sendMessage} className={styles.inputForm}>
                <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default Chat;