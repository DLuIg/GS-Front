// src/app/Registro/page.tsx
'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiUser, FiLock, FiMail, FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/authContext'; // Ajuste o caminho

export default function RegistroPage() {
  const [nome, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [senha, setPassword] = useState<string>('');
  const [confirmarsenha, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();
  // IMPORTANTE: Certifique-se de pegar 'register' e 'isLoading' do useAuth
  const { isAuthenticated, user, register, isLoading: authIsLoading } = useAuth();

  useEffect(() => {
    // Redireciona se já estiver logado E o estado de autenticação não estiver carregando
    if (!authIsLoading && isAuthenticated) {
      router.push('/Mural'); // Ou a página que você definiu como dashboard
    }
  }, [isAuthenticated, authIsLoading, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Log para depuração: Verifique os valores antes da validação
    console.log('Valores no submit:', { nome, email, senha, confirmarsenha });

    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarsenha.trim()) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    if (senha !== confirmarsenha) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Formato de e-mail inválido.');
      return;
    }
    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      // AQUI é onde chamamos a função 'register' do AuthContext
      await register(nome, email, senha , confirmarsenha); // 'register' agora faz a chamada fetch

      setSuccessMessage('Cadastro realizado com sucesso! Você será redirecionado para a página de login em instantes.');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        router.push('/'); // Redireciona para login
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro durante o cadastro.');
      console.error('Erro no handleSubmit do Registro:', err);
    }
  };

  // UI de Carregamento inicial do estado de autenticação
  if (authIsLoading && !isAuthenticated) {
      return (
          <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-4 text-white">
              <p>Carregando...</p>
          </main>
      );
  }

  // UI se já estiver autenticado
  if (!authIsLoading && isAuthenticated) {
    // ... (seu JSX para usuário já logado, redirecionando para o Mural) ...
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 p-4 text-white">
            {/* ... */}
        </main>
    );
  }

  // Formulário de Registro
  return (
    <>
      <Head>
        <title>Cadastro - Vulnerable Voices</title>
        <meta name="description" content="Página de cadastro do Vulnerable Voices." />
      </Head>
      {/* Mantenha a estrutura do seu <main> e <div className="w-full max-w-md ..."> etc. */}
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-4 text-white">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"> {/* Removi transform e hover temporariamente para simplificar */}
          <div className="px-8 py-10 md:px-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-orange-500 mt-2">
                Vulnerable Voices
              </h1>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 text-center mb-6">
              Crie sua Conta
            </h2>

            {error && ( /* ... Sua UI de erroa ... */"Cumpra todos os campos" )}
            {successMessage && ( /* ... Sua UI de sucesso ... */ "Cadastro realizado com sucesso!" )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo Nome */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Nome Completo</label>
                <div className="relative">
                  <FiUser className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-full w-5 text-gray-400" />
                  <input id="name" name="name" type="text" value={nome} onChange={(e) => setName(e.target.value)} disabled={authIsLoading}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Seu nome completo" required />
                </div>
              </div>

              {/* Campo Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <div className="relative">
                  <FiMail className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-full w-5 text-gray-400" />
                  <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={authIsLoading}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="seu@email.com" required />
                </div>
              </div>

              {/* Campo Senha */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Senha</label>
                <div className="relative">
                  <FiLock className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-full w-5 text-gray-400" />
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={senha} onChange={(e) => setPassword(e.target.value)} disabled={authIsLoading}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Crie uma senha forte" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={authIsLoading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-orange-500">
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              {/* Campo Confirmar Senha */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-1">Confirmar Senha</label>
                <div className="relative">
                  <FiLock className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-full w-5 text-gray-400" />
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={confirmarsenha} onChange={(e) => setConfirmPassword(e.target.value)} disabled={authIsLoading}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Confirme sua senha" required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={authIsLoading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-orange-500">
                    {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Botão Cadastrar */}
              <div>
                <button type="submit" disabled={authIsLoading}
                  className={`w-full flex justify-center items-center py-3 px-4 mt-4 border border-transparent rounded-lg shadow-sm text-base font-medium 
                              ${authIsLoading ? 'bg-gray-400 cursor-not-allowed text-gray-700' : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'}
                              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 
                              transition-colors duration-150 ease-in-out`} // Ajuste de classes do botão
                >
                  {authIsLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <FiUserPlus className="mr-2 h-5 w-5" />
                  )}
                  {authIsLoading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
              </div>
            </form>
            <p className="mt-8 text-center text-sm text-gray-500">
              Já tem uma conta?{' '}
              <Link href="/" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                Faça login aqui
              </Link>
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