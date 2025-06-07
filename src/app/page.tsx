// app/page.tsx
'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image'; // 1. Importe o componente Image
import { FiUser, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from './contexts/authContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { login, isLoading: authIsLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Usuário já autenticado:', user);
      
    }
  }, [isAuthenticated, router, user]);


const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  
  event.preventDefault();
  try {
    
    await login(email, password);
     
  } catch (err: any) {
    setError(err.message || 'Falha no login.');
  }
};
// ...
   // Verifica se o usuário já está autenticado
  if (isAuthenticated) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 p-4 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Você já está logado, {user?.nome }!</h1>
          
          <p className="mb-6">Você pode ir para o  <a href="/Mural" className="underline hover:text-yellow-300">Mural</a>.</p>
        </div>
      </main>
    );
  }


  // Renderiza o formulário de login
  return (
    <>
      <Head>
        <title>Login - Vulnerable Voices</title>
        <meta name="description" content="Página de login do Vulnerable Voices." />
        <link rel="icon" href="/images/LogoOriginal.png" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-4 text-white">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.02] duration-300 ease-in-out">
          <div className="px-8 py-10 md:px-10">
            <div className="text-center mb-8">
              
             
              <div className="inline-block"> 
                <Image
                  src="/images/LogoOriginal.png" 
                  alt="Vulnerable Voices Logo"
                  width={260}  
                  height={65} 
                  priority     
                  className="mt-2" 
                />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 text-center mb-8">
              Acesse sua Conta
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out"
                    placeholder="seu@email.com"
                    disabled={authIsLoading}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out"
                    placeholder="••••••••"
                    disabled={authIsLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-orange-500 focus:outline-none"
                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                    disabled={authIsLoading}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded transition duration-150 ease-in-out"
                    disabled={authIsLoading}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-gray-700 select-none"
                  >
                    Lembrar-me
                  </label>
                </div>

                <a
                  href="#" // Defina um link para recuperação de senha se tiver
                  className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Esqueceu a senha?
                </a>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={authIsLoading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white 
                                  bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 
                                  transition-transform transform hover:scale-105 duration-150 ease-in-out
                                  ${authIsLoading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {authIsLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <FiLogIn className="mr-2 h-5 w-5" />
                  )}
                  
                  {authIsLoading ? 'Entrando...' : 'Entrar' }
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Não tem uma conta?{' '}
              <a
                href="/Registro" // Link para sua página de cadastro
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
              >
                Cadastre-se aqui
              </a>
            </p>
          </div>
        </div>

        <footer className="text-center mt-12 text-blue-200 text-sm">
          <p>&copy; {new Date().getFullYear()} Vulnerable Voices. Todos os direitos reservados.</p>
        </footer>
      </main>
    </>
  );
}