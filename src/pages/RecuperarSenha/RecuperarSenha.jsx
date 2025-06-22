import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';

function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const { resetPassword, error, loading } = useAuthValue();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await resetPassword(email);
    if (success) {
      setEnviado(true);
    }
  };

  return (
    <div className="min-h-screen p-12 sm:p-6 flex justify-center items-start font-sans">
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-8"></div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn border border-gray-200">
          <div className="pt-6 px-6 pb-2">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              {enviado ? "Email enviado!" : "Recuperar senha"}
            </h2>
            <p className="text-center text-gray-600 text-sm">Informe seu email para receber um link de redefinição de senha</p>
          </div>
          <div className="py-4 px-10">
            {!enviado ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400"
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                <button
                  className="mt-2 w-full p-2.5 text-white rounded-md text-sm font-medium hover:brightness-110 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#2e5eaa' }}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar link de recuperação"}
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-center text-gray-600">
                  Um email foi enviado para <strong>{email}</strong> com instruções para redefinir sua senha.
                </p>
              </div>
            )}
          </div>
          <div className="py-4 px-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              <Link to="/login" className="text-blue-600 font-medium hover:underline">Voltar para o login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecuperarSenha;