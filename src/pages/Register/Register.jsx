import { useState } from "react";
// import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/Button";
import { MdPersonAdd } from 'react-icons/md';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuthentication } from "../../Hooks/UseAuthentication";

const schema = yup.object().shape({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  password: yup.string().min(6, "A senha deve ter pelo menos 6 caracteres").required("Senha é obrigatória"),
  userType: yup.string().oneOf(["usuario", "profissional"], "Selecione um tipo válido").required("Tipo de conta é obrigatório"),
});

function Register() {
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const { register: registerAccount, error: authError, actionLoading } = useAuthentication();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: { userType: "usuario" },
  });

  // Registro via API
  const onSubmit = async (data) => {
    setFormError("");
    const ok = await registerAccount("", data.email, data.password, data.userType);
    if (ok) {
      navigate("/", { replace: true });
    }
  };


  return (
    <div className="min-h-screen p-12 sm:p-6 flex justify-center items-start font-sans">
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-8"></div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn border border-gray-200">
          <div className="pt-6 px-6 pb-2">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Crie sua conta</h2>
            <p className="text-center text-gray-600 text-sm">Junte-se à plataforma do Autismo Em Foco!</p>
          </div>
          <div className="py-4 px-10">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
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
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Crie uma senha segura"
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
              {(authError || formError) && <p className="text-red-500 text-sm text-center mt-2">{authError || formError}</p>}
              <Button
                type="submit"
                loading={actionLoading}
                loadingText="Cadastrando..."
                variant="primary"
                size="large"
                icon={<MdPersonAdd />}
                ariaLabel="Criar nova conta"
              >
                Cadastrar
              </Button>
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