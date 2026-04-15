import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../shared/validadores/authValidators";

export const LoginForm = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
  });

  const onSubmitForm = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
      {/* Usuario/Email */}
      <div>
        <label htmlFor="usuario" className="block mb-3 text-sm font-semibold text-white">
          Usuario o Email
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-blue-400 group-focus-within:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input
            id="usuario"
            type="text"
            placeholder="usuario@ejemplo.com"
            className={`w-full pl-12 pr-4 py-3 bg-slate-700 border-2 rounded-xl font-medium transition-all duration-300 ${
              errors.usuario
                ? "border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-red-300 placeholder-red-400"
                : "border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 hover:border-slate-500"
            } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
            {...register("usuario")}
            disabled={isLoading}
          />
        </div>
        {errors.usuario && (
          <p className="mt-2 text-sm font-medium text-red-400 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 16.586l-6.687-6.687a1 1 0 00-1.414 1.414l8.1 8.1a1 1 0 001.414 0l8.101-8.1z" clipRule="evenodd" />
            </svg>
            {errors.usuario.message}
          </p>
        )}
      </div>

      {/* Contraseña */}
      <div>
        <label htmlFor="contraseña" className="block mb-3 text-sm font-semibold text-white">
          Contraseña
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-blue-400 group-focus-within:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            id="contraseña"
            type="password"
            placeholder="••••••••••"
            className={`w-full pl-12 pr-4 py-3 bg-slate-700 border-2 rounded-xl font-medium transition-all duration-300 ${
              errors.contraseña
                ? "border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-red-300 placeholder-red-400"
                : "border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 hover:border-slate-500"
            } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
            {...register("contraseña")}
            disabled={isLoading}
          />
        </div>
        {errors.contraseña && (
          <p className="mt-2 text-sm font-medium text-red-400 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 16.586l-6.687-6.687a1 1 0 00-1.414 1.414l8.1 8.1a1 1 0 001.414 0l8.101-8.1z" clipRule="evenodd" />
            </svg>
            {errors.contraseña.message}
          </p>
        )}
      </div>

      {/* Botón Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-8 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:shadow-2xl active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:hover:from-blue-600 disabled:hover:to-indigo-700 transform hover:scale-105 flex items-center justify-center gap-2 border-2 border-transparent hover:border-blue-400"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Iniciando sesión...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Iniciar sesión</span>
          </>
        )}
      </button>
    </form>
  );
};
