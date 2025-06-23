import { useLoadScript } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
import { useRef, useState } from "react";

const libraries = ['places'];

export default function AddressAutocomplete({ onSelect }) {
  const [autocomplete, setAutocomplete] = useState(null);
  const inputRef = useRef();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onLoad = (auto) => {
    setAutocomplete(auto);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onSelect(place.formatted_address, place);
      }
    }
  };

  if (!isLoaded) return <div>Carregando mapa...</div>;

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Digite o endereço"
        className="w-full p-2 border border-gray-300 rounded"
      />
    </Autocomplete>
  );
}
