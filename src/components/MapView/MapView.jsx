import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './MapView.module.css';

// Corrige ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

const MapView = ({ profissionais }) => {
  if (!profissionais || profissionais.length === 0) {
    return <div className={styles.loading}>Nenhum profissional encontrado.</div>;
  }

  const mapCenter = [
    profissionais[0].latitude || -23.5505,
    profissionais[0].longitude || -46.6333
  ];

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapHeader}>
        <h3>Estabelecimentos de Saúde</h3>
        <p>{profissionais.length} estabelecimento(s) encontrado(s)</p>
      </div>

      <MapContainer center={mapCenter} zoom={11} className={styles.map}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {profissionais.map((p) => (
          <Marker
            key={p.id}
            position={[p.latitude, p.longitude]}
            icon={establishmentIcon}
          >
            <Popup>
              <div className={styles.popupContent}>
                <h4>{p.nome}</h4>
                <p><strong>Especialidade:</strong> {p.especialidade}</p>
                <p><strong>Endereço:</strong> {p.endereco}</p>
                <p><strong>Telefone:</strong> {p.telefone}</p>
                <p><strong>Cidade:</strong> {p.cidade}</p>
                <p><strong>Avaliação:</strong> ⭐ {p.avaliacao}</p>
                <div className={styles.horarios}>
                  <strong>Horários disponíveis:</strong>
                  <div className={styles.horariosGrid}>
                    {p.horarios?.map((h, i) => (
                      <span key={i} className={styles.horario}>{h}</span>
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
