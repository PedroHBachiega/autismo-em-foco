import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { googleMapsApi } from '../../services/googleMapsApi';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './MapView.module.css';

// Fix para ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícone customizado para estabelecimentos
const establishmentIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'establishment-marker'
});

const MapView = ({ especialidadeFiltro, cidadeFiltro }) => {
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coordenadas, setCoordenadas] = useState([]);

  useEffect(() => {
    const fetchEstabelecimentos = async () => {
      try {
        setLoading(true);
        
        // Usar a mesma API que a tela de agendamento
        const filters = {
          city: cidadeFiltro,
          specialty: especialidadeFiltro
        };
        
        const establishments = await googleMapsApi.getEstablishments(filters);
        
        // Geocodificar endereços para obter coordenadas
        const establishmentsWithCoords = await Promise.all(
          establishments.map(async (establishment) => {
            try {
              const coords = await geocodeAddress(establishment.endereco);
              return {
                ...establishment,
                latitude: coords.lat,
                longitude: coords.lng
              };
            } catch (error) {
              console.warn(`Erro ao geocodificar ${establishment.endereco}:`, error);
              return null;
            }
          })
        );
        
        // Filtrar estabelecimentos que conseguiram ser geocodificados
        const validEstablishments = establishmentsWithCoords.filter(est => est !== null);
        
        setEstabelecimentos(validEstablishments);
        setCoordenadas(validEstablishments.map(est => [est.latitude, est.longitude]));
        
      } catch (error) {
        console.error('Erro ao buscar estabelecimentos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstabelecimentos();
  }, [especialidadeFiltro, cidadeFiltro]);

  // Função para geocodificar endereços
  const geocodeAddress = async (address) => {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
        reject(new Error('Google Maps não carregado'));
        return;
      }
      
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          reject(new Error(`Geocoding falhou: ${status}`));
        }
      });
    });
  };

  if (loading) {
    return <div className={styles.loading}>Carregando mapa...</div>;
  }

  // Centro padrão (São Paulo)
  const defaultCenter = [-23.5505, -46.6333];
  
  // Se há estabelecimentos, centralizar no primeiro
  const mapCenter = estabelecimentos.length > 0 
    ? [estabelecimentos[0].latitude, estabelecimentos[0].longitude]
    : defaultCenter;

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapHeader}>
        <h3>Estabelecimentos de Saúde</h3>
        <p>{estabelecimentos.length} estabelecimento(s) encontrado(s)</p>
      </div>
      
      <MapContainer 
        center={mapCenter} 
        zoom={10} 
        className={styles.map}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {estabelecimentos.map((estabelecimento) => (
          <Marker
            key={estabelecimento.id}
            position={[estabelecimento.latitude, estabelecimento.longitude]}
            icon={establishmentIcon}
          >
            <Popup>
              <div className={styles.popupContent}>
                <h4>{estabelecimento.nome}</h4>
                <p><strong>Especialidade:</strong> {estabelecimento.especialidade}</p>
                <p><strong>Endereço:</strong> {estabelecimento.endereco}</p>
                <p><strong>Telefone:</strong> {estabelecimento.telefone}</p>
                <p><strong>Cidade:</strong> {estabelecimento.cidade}</p>
                <p><strong>Avaliação:</strong> ⭐ {estabelecimento.avaliacao}</p>
                <div className={styles.horarios}>
                  <strong>Horários disponíveis:</strong>
                  <div className={styles.horariosGrid}>
                    {estabelecimento.horarios?.map((horario, index) => (
                      <span key={index} className={styles.horario}>{horario}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;