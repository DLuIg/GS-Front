// app/contexts/authContext.tsx
'use client';

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Correto para App Router
import { API_BASE_URL, getHeaders } from '../services/api'; // Ajuste o caminho se necessário
import { User } from '../types/typesAndInterfaces';





interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string, confirmarsenha:string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const USER_DATA_STORAGE_KEY = 'currentUserData';
const AUTH_TOKEN_KEY = 'authToken';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

    useEffect(() => {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedUserData = localStorage.getItem(USER_DATA_STORAGE_KEY);
      if (storedToken && storedUserData) {
        try {
          setUser(JSON.parse(storedUserData));
          setToken(storedToken);
        } catch (e) {
          localStorage.removeItem(USER_DATA_STORAGE_KEY);
          localStorage.removeItem(AUTH_TOKEN_KEY);
        }
      }
      setIsLoading(false);
    }, []); 

  const login = useCallback(async (email: string, senha: string): Promise<void> => {
    setIsLoading(true);
    console.log("dentro de login")
    const commonHeaders = getHeaders(); // Headers de services/api.ts

    try {
      console.log("tentando logar")
      const response = await fetch(`${API_BASE_URL}/login`, { // Ajuste o endpoint se necessário
        method: 'POST',
        headers: {
          ...commonHeaders,
          // Não precisa de 'Authorization' header para login
        },
        
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha no login.');
      }
      if (!data.id || !data.nome) {
        throw new Error('Resposta de login inválida do servidor.');
      }

      console.log(data.nome)
      console.log(data.id)
      
      setUser({ id: data.id, nome: data.nome });
      setToken(null);
      
      localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify({ id: data.id, nome: data.nome }));
      router.push('/Mural'); 
    } catch (error: any) {
      setUser(null);
      setToken(null);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_STORAGE_KEY);
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async (nome: string, email: string, senha: string, confirmarsenha:string): Promise<void> => {
    setIsLoading(true);
    const commonHeaders = getHeaders();

    try {
      const response = await fetch(`${API_BASE_URL}/usuario`, { // Ajuste o endpoint de registro
        method: 'POST',
        headers: {
          ...commonHeaders,
        },
        body: JSON.stringify({ nome, email, senha, confirmarsenha }), // Verifique se o backend espera 'password' ou 'password_hash' etc.
      });

      const data = await response.json(); // Mesmo que não use, para verificar a resposta

      if (!response.ok) {
        throw new Error(data.message || 'Falha no registro.');
      }
      // Após o registro, você pode querer que o usuário faça login ou logá-lo automaticamente se o backend retornar um token.
      // Por enquanto, apenas consideramos o registro bem-sucedido.
      console.log('Registro bem-sucedido:', data);
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_STORAGE_KEY);
    router.push('/');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};