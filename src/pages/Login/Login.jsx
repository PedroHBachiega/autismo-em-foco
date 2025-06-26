import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import GoogleButton from '../../components/GoogleButton';
import Button from '../../components/Button';
import { MdLogin } from 'react-icons/md';
import { useAuthentication } from '../../hooks/useAuthentication';
import { useGTM } from '../../context/GTMContext';
import { useAgendamentoToast } from '../../Hooks/useAgendamentoToast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  senha: yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória'),
});

function Login() {
  const { login, loginWithGoogle, error, loading } = useAuthentication();
  const { trackLogin } = useGTM();
  const { showErrorToast } = useAgendamentoToast();
  const location = useLocation();
  const navigate = useNavigate();

  const fromPath = location.state?.from || '/';
  const message = location.state?.message;
  const [loginMessage, setLoginMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
  });

  // ✅ Corrigido: evita toast duplicado
  useEffect(() => {
    const hasShown = sessionStorage.getItem('hasShownToast');

    if (message && !hasShown) {
      setLoginMessage(message);
      showErrorToast(message);
      sessionStorage.setItem('hasShownToast', 'true');

      setTimeout(() => {
        setLoginMessage('');
        sessionStorage.removeItem('hasShownToast');
      }, 5000);
    }
  }, [message, showErrorToast]);

  const onSubmit = async (data) => {
    try {
      const result = await login(data.email, data.senha);
      if (result) {
        trackLogin('email');
        navigate(fromPath, { replace: true });
      }
    } catch (err) {
      console.error('Erro no login:', err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (result) {
        trackLogin('google');
        navigate(fromPath, { replace: true });
      }
    } catch (err) {
      console.error('Erro no login com Google:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta!</h1>
          <p className="text-gray-600">Entre na sua conta para continuar</p>
        </div>

        {/* Mensagem de redirecionamento */}
        {loginMessage && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md text-sm">
            {loginMessage}
          </div>
        )}

        {/* Card de login */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                  className={`w-full p-2.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400`}
                  onBlur={() => trigger('email')}
                  autoComplete="email"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <span id="email-error" className="text-red-500 text-xs">{errors.email.message}</span>
                )}
              </div>

              {/* Senha */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="senha" className="text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <Link to="/recuperar-senha" className="text-xs text-blue-600 hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
                <input
                  id="senha"
                  type="password"
                  placeholder="Sua senha"
                  {...register('senha')}
                  className={`w-full p-2.5 border ${errors.senha ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400`}
                  onBlur={() => trigger('senha')}
                  autoComplete="current-password"
                  aria-invalid={errors.senha ? 'true' : 'false'}
                  aria-describedby={errors.senha ? 'senha-error' : undefined}
                />
                {errors.senha && (
                  <span id="senha-error" className="text-red-500 text-xs">{errors.senha.message}</span>
                )}
              </div>

              {/* Erro de autenticação */}
              {error && (
                <p className="text-red-500 text-sm text-center mt-2">{error}</p>
              )}

              {/* Botões de ação */}
              <Button
                type="submit"
                loading={loading}
                loadingText="Entrando..."
                variant="primary"
                size="large"
                icon={<MdLogin />}
                ariaLabel="Entrar na conta"
              >
                Entrar
              </Button>

              <GoogleButton
                onClick={handleGoogleLogin}
                loading={loading}
                text="Entrar com Google"
              />
            </form>
          </div>

          {/* Link para cadastro */}
          <div className="py-4 px-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
