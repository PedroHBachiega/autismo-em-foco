import { useState } from "react";
import { auth, db } from "../../firebase/config";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
<<<<<<< HEAD
import { setDoc, doc, getDoc } from "firebase/firestore";
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
    trigger,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: { userType: "usuario" },
  });

  // Registro com Email e Senha
  const onSubmit = async (data) => {
=======
import { setDoc, doc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import GoogleButton from "../../components/GoogleButton";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Registro com Email e Senha
  const handleRegister = async (e) => {
    e.preventDefault();
>>>>>>> origin/main
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
<<<<<<< HEAD
        data.email,
        data.password
=======
        email,
        password
>>>>>>> origin/main
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
<<<<<<< HEAD
        userType: data.userType,
        isProfileComplete: false,
      });
      navigate("/");
    } catch (err) {
=======
      });
      navigate("/home");
    } catch (err) {
      console.error("Erro ao criar conta:", err);
>>>>>>> origin/main
      setError("Erro ao criar conta: " + err.message);
    }
    setLoading(false);
  };

  // Registro/Login com Google
  const handleGoogleRegister = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
<<<<<<< HEAD
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          createdAt: new Date(),
          userType: "usuario", // padrão para Google
          isProfileComplete: false,
        });
      }
      navigate("/");
    } catch (err) {
=======
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
      });
      navigate("/home");
    } catch (err) {
      console.error("Erro no login com Google:", err);
>>>>>>> origin/main
      setError("Erro ao autenticar com Google: " + err.message);
    }
    setLoading(false);
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen p-12 sm:p-6 flex justify-center items-start font-sans">
=======
    <div className="min-h-screen  p-12 sm:p-6 flex justify-center items-start font-sans">
>>>>>>> origin/main
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-8"></div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn border border-gray-200">
          <div className="pt-6 px-6 pb-2">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Crie sua conta</h2>
<<<<<<< HEAD
            <p className="text-center text-gray-600 text-sm">Junte-se à plataforma do Autismo Em Foco!</p>
          </div>
          <div className="py-4 px-10">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
=======
            <p className="text-center text-gray-500 text-sm">Junte-se à plataforma do Autismo Em Foco!</p>
          </div>
          <div className="py-4 px-10">
            <form onSubmit={handleRegister} className="flex flex-col gap-5">
>>>>>>> origin/main
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
<<<<<<< HEAD
                  {...register("email")}
                  className={`w-full p-2.5 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400`}
                  onBlur={() => trigger("email")}
                  autoComplete="email"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <span id="email-error" className="text-red-500 text-xs">{errors.email.message}</span>
                )}
=======
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400"
                  required
                />
>>>>>>> origin/main
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Crie uma senha segura"
<<<<<<< HEAD
                  {...register("password")}
                  className={`w-full p-2.5 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400`}
                  onBlur={() => trigger("password")}
                  autoComplete="new-password"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                {errors.password && (
                  <span id="password-error" className="text-red-500 text-xs">{errors.password.message}</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="userType" className="text-sm font-medium text-gray-700">Tipo de Conta</label>
                <select
                  id="userType"
                  {...register("userType")}
                  className={`w-full p-2.5 border ${errors.userType ? "border-red-500" : "border-gray-300"} rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                  onBlur={() => trigger("userType")}
                  defaultValue="usuario"
                  aria-invalid={errors.userType ? "true" : "false"}
                  aria-describedby={errors.userType ? "userType-error" : undefined}
                >
                  <option value="usuario">Usuário</option>
                  <option value="profissional">Profissional</option>
                </select>
                {errors.userType && (
                  <span id="userType-error" className="text-red-500 text-xs">{errors.userType.message}</span>
                )}
              </div>
              {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
              <Button
                type="submit"
                loading={loading}
                loadingText="Cadastrando..."
                variant="primary"
                size="large"
                icon={<MdPersonAdd />}
                ariaLabel="Criar nova conta"
              >
                Cadastrar
              </Button>
=======
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {loading ? "Entrando..." : "Entrar"}
              </button>

>>>>>>> origin/main
              <GoogleButton
                onClick={handleGoogleRegister}
                loading={loading}
                text="Cadastrar com Google"
              />
            </form>
          </div>
          <div className="py-4 px-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              Já possui uma conta?{' '}
              <Link to="/" className="text-blue-600 font-medium hover:underline">Faça login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default Register;
=======
export default Register;
>>>>>>> origin/main
