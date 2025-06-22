import { useState, useCallback } from 'react';

// Substitua pela sua chave de API do Google Maps
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const googleMapsApi = {
  /**
   * Busca estabelecimentos de saúde com base nos filtros
   * @param {Object} filters - Filtros para a busca
   * @param {string} filters.city - Cidade do estabelecimento
   * @param {string} filters.specialty - Especialidade médica
   * @returns {Promise<Array>} Lista de estabelecimentos
   */
  async getEstablishments(filters = {}) {
    try {
      // Verificar se a API do Google Maps está carregada
      if (!window.google || !window.google.maps) {
        await this.loadGoogleMapsScript();
      }

      // Construir a consulta de busca
      let query = '';
      
      // Adicionar especialidade à consulta se fornecida
      if (filters.specialty) {
        query += filters.specialty + ' ';
      }
      
      // Adicionar termos de busca específicos para estabelecimentos de saúde
      query += 'saúde clínica hospital';
      
      // Adicionar cidade à consulta se fornecida
      if (filters.city) {
        query += ' em ' + filters.city;
      }

      // Usar a API de Geocodificação para obter as coordenadas da cidade
      const geocoder = new window.google.maps.Geocoder();
      const geocodeResult = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: filters.city || 'Brasil' }, (results, status) => {
          if (status === 'OK') {
            resolve(results[0]);
          } else {
            reject(new Error(`Geocode falhou: ${status}`));
          }
        });
      });

      const location = geocodeResult.geometry.location;
      
      // Criar um elemento div para o serviço Places
      const mapDiv = document.createElement('div');
      document.body.appendChild(mapDiv);
      
      // Criar um mapa mínimo necessário para o serviço Places
      const map = new window.google.maps.Map(mapDiv, {
        center: location,
        zoom: 15,
      });
      
      // Criar o serviço Places com o mapa
      const placesService = new window.google.maps.places.PlacesService(map);
      
      // Configurar a solicitação de busca
      const request = {
        location: location,
        radius: 5000, // 5km
        query: query,
        // Remover o tipo, pois será especificado na consulta de texto
      };

      // Executar a busca de texto
      const results = await new Promise((resolve, reject) => {
        placesService.textSearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve(results);
          } else {
            reject(new Error(`Places API falhou: ${status}`));
          }
        });
      });
      
      // Limpar o elemento div criado
      document.body.removeChild(mapDiv);

      // Formatar os resultados para o formato esperado pelo componente
      return results.map(place => ({
        id: place.place_id,
        nome: place.name,
        especialidade: filters.specialty || 'Estabelecimento de Saúde',
        endereco: place.formatted_address,
        cidade: filters.city || 'Não especificado',
        telefone: place.formatted_phone_number || 'Não disponível',
        avaliacao: place.rating || 4.0,
        imagem: place.photos && place.photos.length > 0 
          ? place.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 })
          : "https://placehold.co/600x400/2361ad/FFF?text=Estabelecimento",
        horarios: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
      }));
    } catch (error) {
      console.error('Erro ao buscar estabelecimentos:', error);
      // Em caso de falha na API, retornar array vazio ou dados simulados
      return this.getMockEstablishments(filters.city, filters.specialty);
    }
  },

  /**
   * Carrega o script da API do Google Maps
   * @returns {Promise} Promise que resolve quando o script é carregado
   */
  loadGoogleMapsScript() {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps && window.google.maps.places) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  /**
   * Função de fallback que retorna dados simulados caso a API esteja indisponível
   * @param {string} city - Cidade para filtrar
   * @param {string} specialty - Especialidade para filtrar
   * @returns {Array} Lista de estabelecimentos simulados
   */
  getMockEstablishments(city, specialty) {
    // Reutilizando a mesma função de dados simulados do cnesApi.js
    const mockData = [
      {
        id: 1,
        nome: "Clínica Especializada em TEA",
        especialidade: "Clínica Multidisciplinar",
        endereco: "Av. Principal, 1000",
        cidade: "São Paulo",
        telefone: "(11) 3456-7890",
        avaliacao: 4.9,
        imagem: "https://placehold.co/600x400/2361ad/FFF?text=Clínica",
        horarios: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
      },
      {
        id: 2,
        nome: "Centro de Atendimento Especializado",
        especialidade: "Neuropsicologia",
        endereco: "Rua das Flores, 500",
        cidade: "São Paulo",
        telefone: "(11) 2345-6789",
        avaliacao: 4.8,
        imagem: "https://placehold.co/600x400/2361ad/FFF?text=Centro",
        horarios: ["08:00", "09:00", "10:00", "13:00", "14:00", "15:00"]
      },
      {
        id: 3,
        nome: "Instituto de Desenvolvimento Infantil",
        especialidade: "Terapia Ocupacional",
        endereco: "Av. Secundária, 200",
        cidade: "São Paulo",
        telefone: "(11) 3333-4444",
        avaliacao: 4.7,
        imagem: "https://placehold.co/600x400/2361ad/FFF?text=Instituto",
        horarios: ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
      }
    ];
    
    // Filtrar por cidade se fornecida
    let filtered = mockData;
    if (city) {
      filtered = filtered.filter(item => 
        item.cidade.toLowerCase().includes(city.toLowerCase())
      );
    }
    
    // Filtrar por especialidade se fornecida
    if (specialty) {
      filtered = filtered.filter(item => 
        item.especialidade.toLowerCase().includes(specialty.toLowerCase())
      );
    }
    
    return filtered;
  }
};

/**
 * Hook personalizado para usar a API do Google Maps Places
 * @returns {Object} Funções e estados para usar a API
 */
export const useGoogleMapsPlaces = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const loadGoogleMapsScript = useCallback(async () => {
    try {
      await googleMapsApi.loadGoogleMapsScript();
      setIsLoaded(true);
    } catch (error) {
      console.error('Erro ao carregar o script do Google Maps:', error);
      setLoadError(error);
    }
  }, []);

  return { isLoaded, loadError, loadGoogleMapsScript };
};