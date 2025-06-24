import { useTheme } from '../context/ThemeContext'
import { FaAccessibleIcon } from 'react-icons/fa'

const HighContrastToggle = () => {
    const { isHighContrast, toggleHighContrast } = useTheme();
    
    return (
        <button
            onClick={toggleHighContrast}
            className={`fixed bottom-8 left-4 p-3 rounded-full 
            shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none
            focus:ring-2 focus:ring-blue-500 z-[10000] 
            ${isHighContrast ? 'bg-black' : 'bg-gray-700'}`}
            aria-label={isHighContrast ? 'Desativar alto contraste' : 'Ativar alto contraste'}
        >
            <FaAccessibleIcon className={`w-6 h-6 ${isHighContrast ? 'text-yellow-400' : 'text-white'}`} />
        </button>
    );
};

export default HighContrastToggle;