import { useState } from "react";
import { auth } from "../../firebase/config";
import { signInWithCustomToken, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import GoogleButton from "../../components/GoogleButton";
import Button from "../../components/Button";
import { MdPersonAdd } from 'react-icons/md';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  password: yup.string().min(6, "A senha deve ter pelo menos 6 caracteres").required("Senha é obrigatória"),
  userType: yup.string().oneOf(["usuario", "profissional"], "Selecione um tipo válido").required("Tipo de conta é obrigatório"),
});

function Register() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { userType: "usuario" },
  });

  // --------------------------------------------
  // REGISTRO VIA API + LOGIN AUTOMÁTICO FIREBASE
  // --------------------------------------------
  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://apiautismoemfoco.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.email.split("@")[0],
          email: data.email,
          senha: data.password,
          userType: data.userType
        })
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Erro ao criar conta.");
        setLoading(false);
        return;
      }

      const { user, token, firebaseToken } = result;

      // Login Firebase com custom token da API
      await signInWithCustomToken(auth, firebaseToken);

      // Armazenar sessão (importante para rotas privadas)
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");
    } catch (err) {
      setError("Erro inesperado: " + err.message);
    }

    setLoading(false);
  };

  // --------------------------------------------------
  // REGISTRO COM GOOGLE (AINDA NÃO USA API)
  // ajustaremos depois se quiser integrar completamente
  // --------------------------------------------------
  const handleGoogleRegister = async () => {
    setLoading(true);
    setError("");

    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Fazer integração com API depois (se quiser)
      console.log("Login Google OK:", user);

      navigate("/");
    } catch (err) {
      setError("Erro ao autenticar com Google: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-12 sm:p-6 flex justify-center items-start font-sans">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="pt-6 px-6 pb-2">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Crie sua conta</h2>
            <p className="text-center text-gray-600 text-sm">Junte-se à plataforma do Autismo Em Foco!</p>
          </div>

          <div className="py-4 px-10">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
              
              {/* EMAIL */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email")}
                  className={`w-full p-2.5 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md`}
                  onBlur={() => trigger("email")}
                />
                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
              </div>

              {/* SENHA */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Crie uma senha segura"
                  {...register("password")}
                  className={`w-full p-2.5 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md`}
                  onBlur={() => trigger("password")}
                />
                {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
              </div>

              {/* TIPO DE CONTA */}
              <div className="flex flex-col gap-2">
                <label htmlFor="userType" className="text-sm font-medium text-gray-700">Tipo de Conta</label>
                <select
                  id="userType"
                  {...register("userType")}
                  className={`w-full p-2.5 border ${errors.userType ? "border-red-500" : "border-gray-300"} rounded-md`}
                >
                  <option value="usuario">Usuário</option>
                  <option value="profissional">Profissional</option>
                </select>
                {errors.userType && <span className="text-red-500 text-xs">{errors.userType.message}</span>}
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              {/* BOTÃO CRIAR */}
              <Button
                type="submit"
                loading={loading}
                loadingText="Cadastrando..."
                variant="primary"
                size="large"
                icon={<MdPersonAdd />}
              >
                Cadastrar
              </Button>

              {/* GOOGLE */}
              <GoogleButton
                onClick={handleGoogleRegister}
                loading={loading}
                text="Cadastrar com Google"
              />
            </form>
          </div>

          <div className="py-4 px-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              Já possui uma conta?{" "}
              <Link to="/" className="text-blue-600 font-medium hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
