import { useState, useEffect } from "react"
import { db } from "../firebase/config"
import api from "../services/apiClient"
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    where
} from "firebase/firestore"

export const useFetchDocuments = (docCollection, search = null, uid = null  ) => {
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const [cancelled, setCancelled] = useState(false);

    useEffect(() => {
        async function loadData() {
            if (cancelled) return;

            setLoading(true);

            // Route agendamentos through API; others keep Firestore realtime
            if (docCollection === 'agendamentos') {
                try {
                    const items = await api.get('/agendamentos')
                    let filtered = Array.isArray(items) ? items : []
                    if (uid) {
                        filtered = filtered.filter(item => item?.uid === uid)
                    }
                    if (search) {
                        const s = String(search).toLowerCase()
                        filtered = filtered.filter(item => Array.isArray(item?.tags)
                            ? item.tags.some(t => String(t).toLowerCase().includes(s))
                            : false)
                    }
                    // Sort by createdAt desc if present, else by data/horario
                    filtered.sort((a, b) => {
                        const ca = a.createdAt ? new Date(a.createdAt) : null
                        const cb = b.createdAt ? new Date(b.createdAt) : null
                        if (ca && cb) return cb - ca
                        // Fallback: sort by date/time string
                        const da = `${a.data || ''} ${a.horario || ''}`
                        const dbs = `${b.data || ''} ${b.horario || ''}`
                        return dbs.localeCompare(da)
                    })
                    setDocuments(filtered)
                } catch (err) {
                    console.log(err)
                    setError(err.message)
                } finally {
                    setLoading(false)
                }
                return
            }

            const collectionRef = await collection(db, docCollection);

            try{
                let q;

                if (search) {
                    q = await query(collectionRef, where("tags", "array-contains", search), orderBy("createdAt", "desc"));
                } else if (uid) {
                    q = await query(collectionRef, where("uid", "==", uid), orderBy("createdAt", "desc"));
                } else {
                    q = await query(collectionRef, orderBy("createdAt", "desc"));
                }

                await onSnapshot(q, (querysnapshot) => {
                    setDocuments(querysnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    })));
                });

                setLoading(false);
            } catch (error) {
                console.log(error);
                setError(error.message);
                setLoading(false);
            }
        }

        loadData();
    }, [docCollection, search, uid, cancelled]);

    useEffect(() => {
        return () => setCancelled(true);
    }, []);

    return { documents, loading, error };
}



