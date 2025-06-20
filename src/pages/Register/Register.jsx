import { useState } from "react";
import { auth, db } from "../../firebase/config";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Adicione esta importação no topo do arquivo, junto com as outras importações
import { setDoc, doc, getDoc } from "firebase/firestore";

import { useNavigate, Link } from "react-router-dom";
import GoogleButton from "../../components/GoogleButton";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("usuario"); // Novo estado para tipo de usuário
  const navigate = useNavigate();

  // Registro com Email e Senha
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),

        userType: userType, // Adicionando o tipo de usuário
        isProfileComplete: false,
      });
      navigate("/");

    } catch (err) {
      console.error("Erro ao criar conta:", err);
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

      
      // Verificar se o usuário já existe
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Se não existir, criar com o tipo selecionado
        await setDoc(userDocRef, {
          email: user.email,
          createdAt: new Date(),
          userType: userType, // Adicionando o tipo de usuário
          isProfileComplete: false,
        });
      }
      
      navigate("/");

    } catch (err) {
      console.error("Erro no login com Google:", err);
      setError("Erro ao autenticar com Google: " + err.message);
    }
    setLoading(false);
  };

  return (

    <div className="min-h-screen p-12 sm:p-6 flex justify-center items-start font-sans">

      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-8"></div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn border border-gray-200">
          <div className="pt-6 px-6 pb-2">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Crie sua conta</h2>
            <p className="text-center text-gray-500 text-sm">Junte-se à plataforma do Autismo Em Foco!</p>
          </div>
          <div className="py-4 px-10">
            <form onSubmit={handleRegister} className="flex flex-col gap-5">
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
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Crie uma senha segura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400"
                  required
                />
              </div>
              
              {/* Seleção de tipo de usuário */}
              <div className="flex flex-col gap-2">
                <label htmlFor="userType" className="text-sm font-medium text-gray-700">Tipo de Conta</label>
                <select
                  id="userType"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="usuario">Usuário</option>
                  <option value="profissional">Profissional</option>
                </select>
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


export default Register;

