import { useState, useEffect } from "react"
import { db } from "../firebase/config"
import {
    collection,
    getDocs
} from "firebase/firestore"

export const useFetchEventos = (filtroData = "todos", filtroCategoria = "Todos") => {
    const [eventos, setEventos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const collectionRef = collection(db, "eventos");
                const snapshot = await getDocs(collectionRef);
                
                if (snapshot.empty) {
                    setEventos([]);
                    setLoading(false);
                    return;
                }
                
                let todosEventos = [];
                snapshot.forEach((doc) => {
                    todosEventos.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                
                let eventosFiltrados = [...todosEventos];
                
                if (filtroData !== "todos") {
                    const hoje = new Date();
                    hoje.setHours(0, 0, 0, 0);
                    
                    if (filtroData === "futuros") {
                        eventosFiltrados = eventosFiltrados.filter(evento => {
                            if (!evento.dataEvento) return false;
                            try {
                                const dataEvento = evento.dataEvento.toDate();
                                dataEvento.setHours(0, 0, 0, 0);
                                return dataEvento >= hoje;
                            } catch (err) {
                                return false;
                            }
                        });
                    } else if (filtroData === "passados") {
                        eventosFiltrados = eventosFiltrados.filter(evento => {
                            if (!evento.dataEvento) return false;
                            try {
                                const dataEvento = evento.dataEvento.toDate();
                                dataEvento.setHours(0, 0, 0, 0);
                                return dataEvento < hoje;
                            } catch (err) {
                                return false;
                            }
                        });
                        eventosFiltrados.sort((a, b) => {
                            try {
                                return b.dataEvento.toDate() - a.dataEvento.toDate();
                            } catch (err) {
                                return 0;
                            }
                        });
                    }
                }
                
                if (filtroCategoria && filtroCategoria !== "Todos") {
                    eventosFiltrados = eventosFiltrados.filter(evento => {
                        const categoriaEvento = (evento.categoria || "").toLowerCase().trim();
                        const categoriaFiltro = filtroCategoria.toLowerCase().trim();
                        return categoriaEvento === categoriaFiltro;
                    });
                }
                
                setEventos(eventosFiltrados);
                setLoading(false);
                
            } catch (error) {
                if (error.code === 'permission-denied') {
                    setError('Sem permissão para acessar os eventos. Verifique as regras do Firestore.');
                } else if (error.code === 'unavailable') {
                    setError('Firestore indisponível. Verifique sua conexão.');
                } else {
                    setError(`Erro ao carregar eventos: ${error.message}`);
                }
                
                setEventos([]);
                setLoading(false);
            }
        };
        
        fetchEventos();
        
    }, [filtroData, filtroCategoria]);

    return { eventos, loading, error };
}