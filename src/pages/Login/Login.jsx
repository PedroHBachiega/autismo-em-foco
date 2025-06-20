import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GoogleButton from '../../components/GoogleButton';
import { useAuthValue } from '../../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login, loginWithGoogle, error, loading } = useAuthValue();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, senha);
  };

  return (
    <div className="min-h-screen  p-12 sm:p-6 flex justify-center items-start font-sans">
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-8"></div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn border border-gray-200">
          <div className="pt-6 px-6 pb-2">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Bem-vindo de volta</h2>
            <p className="text-center text-gray-600 text-sm">Acesse sua conta</p>
          </div>
          <div className="py-4 px-10">
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
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="senha" className="text-sm font-medium text-gray-700">Senha</label>
                  <Link to="/recuperar-senha" className="text-xs text-blue-700 hover:underline">Esqueceu a senha?</Link>
                </div>
                <input
                  id="senha"
                  type="password"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
              <button

                className="mt-2 w-full p-2.5 text-white rounded-md text-sm font-medium hover:brightness-110 disabled:bg-blue-700 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#1d4ed8' }}

                type="submit"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>

              <GoogleButton
                onClick={loginWithGoogle}
                loading={loading}
                text="Entrar com Google"
              />
            </form>
          </div>
          <div className="py-4 px-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-700">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-blue-800 font-medium hover:underline hover:text-blue-900">Cadastre-se</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;