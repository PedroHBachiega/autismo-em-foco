import { useState, useEffect } from "react";
import api from "../services/apiClient";

export const useFetchEventos = (filtroData = "todos", filtroCategoria = "Todos") => {
  const [eventos, setEventos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        setError(null);
        const todosEventos = await api.get('/eventos');
        let eventosFiltrados = (todosEventos || []).map(e => ({
          ...e,
          dataEvento: e.dataEvento ? new Date(e.dataEvento) : null,
        }));
        
        if (filtroData !== "todos") {
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);
          
          if (filtroData === "futuros") {
            eventosFiltrados = eventosFiltrados.filter(evento => {
              if (!evento.dataEvento) return false;
              try {
                const dataEvento = new Date(evento.dataEvento);
                dataEvento.setHours(0, 0, 0, 0);
                return dataEvento >= hoje;
              } catch {
                return false;
              }
            });
          } else if (filtroData === "passados") {
            eventosFiltrados = eventosFiltrados.filter(evento => {
              if (!evento.dataEvento) return false;
              try {
                const dataEvento = new Date(evento.dataEvento);
                dataEvento.setHours(0, 0, 0, 0);
                return dataEvento < hoje;
              } catch {
                return false;
              }
            });

            eventosFiltrados.sort((a, b) => {
              try {
                return new Date(b.dataEvento) - new Date(a.dataEvento);
              } catch {
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
