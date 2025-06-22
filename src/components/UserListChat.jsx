import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useAuthValue } from "../context/AuthContext";
import { db } from "../firebase/config";
import Chat from "./Chat";
import styles from "./UserListChat.module.css";

const UserListChat = () => {
    const { user } = useAuthValue();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const userList = querySnapshot.docs
                .map((doc) => ({ uid: doc.id, ...doc.data() }))
                .filter((u) => u.uid !== user.uid);
                console.log("Usuários disponíveis: ", userList);
                setUsers(userList);

        };

        fetchUsers();
    }, [user]);

    return (
        <div className={styles.container}>
            <h2>Conversas</h2>
            {!selectedUser ? (
                <ul className={styles.userList}>
                    {users.map((u) => (
                        <li
                            key={u.uid}
                            className={styles.userItem}
                            onClick={() => setSelectedUser(u)}
                        >
                            {u.displayName || u.email}
                        </li>
                    ))}
                </ul>
            ) : (
                <>
                    <button className={styles.backButton} onClick={() => setSelectedUser(null)}>
                        Voltar
                    </button>
                    <Chat otherUser={selectedUser} />
                </>
            )}
        </div>
    );
};

export default UserListChat;