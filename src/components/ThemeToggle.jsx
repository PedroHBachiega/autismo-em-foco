import { useTheme } from '../context/ThemeContext'
import { FaSun, FaMoon } from 'react-icons/fa'

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();
    
    return (
        <button
            onClick={toggleTheme}
            className={`fixed bottom-8 right-4 p-3 rounded-full \
            shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none\n    focus:ring-2 focus:ring-blue-500 z-[10000] \
            ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
            {isDark ? (
                <FaSun className="w-6 h-6 text-yellow-500" />
            ) : (
                <FaMoon className="w-6 h-6 text-gray-700" />
            )}
        </button>
    );
};

export default ThemeToggle;