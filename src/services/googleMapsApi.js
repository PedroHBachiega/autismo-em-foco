const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const googleMapsApi = {
  async getEstablishments(filters = {}) {
    try {
      if (!window.google || !window.google.maps) {
        await this.loadGoogleMapsScript();
      }

      const { city, specialty, lat, lng } = filters;
      const query = `${specialty || ''} clínica hospital saúde${city ? ` em ${city}` : ''}`.trim();

      // Define a localização se latitude e longitude forem fornecidas
      const location = lat && lng
        ? new window.google.maps.LatLng(lat, lng)
        : null;

      const request = {
        query,
        radius: 5000,
        location
      };

      // Usar PlacesService do Google diretamente com textSearch
      const mapDiv = document.createElement('div');
      document.body.appendChild(mapDiv);
      const map = new window.google.maps.Map(mapDiv);
      const placesService = new window.google.maps.places.PlacesService(map);

      const results = await new Promise((resolve, reject) =>
        placesService.textSearch(request, (res, status) =>
          status === window.google.maps.places.PlacesServiceStatus.OK
            ? resolve(res)
            : reject(new Error(status))
        )
      );
      document.body.removeChild(mapDiv);

      return results.map((place) => ({
        id: place.place_id,
        nome: place.name,
        especialidade: specialty || 'Estabelecimento de Saúde',
        endereco: place.formatted_address,
        cidade: city || 'Não especificado',
        telefone: place.formatted_phone_number || 'Não disponível',
        avaliacao: place.rating || 0,
        imagem: place.photos?.[0]?.getUrl({ maxWidth: 400 }) ?? 'https://via.placeholder.com/150',
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        horarios: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00']
      }));
    } catch (err) {
      console.error('Erro Places API:', err);
      return this.getMockEstablishments(filters.city, filters.specialty);
    }
  },

  loadGoogleMapsScript() {
    return new Promise((resolve, reject) => {
      if (window.google?.maps?.places) return resolve();
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  getMockEstablishments(city, specialty) {
    return [
      {
        id: 'mock-1',
        nome: 'Clínica Exemplo',
        especialidade: specialty,
        endereco: 'Rua Exemplo, 123',
        cidade: city || 'São Paulo',
        telefone: '(11) 0000-0000',
        avaliacao: 4.5,
        imagem: 'https://via.placeholder.com/150',
        latitude: -23.5505,
        longitude: -46.6333,
        horarios: ['09:00', '10:00', '11:00']
      }
    ];
  }
};
