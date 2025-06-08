// services/api.ts

// A API está rodando apenas localmente por enquanto
const isBrowser = typeof window !== "undefined";

export const API_BASE = isBrowser
    ? "https://quarkus-gs-production.up.railway.app" // <-- Adicionado HTTPS aqui
    : "http://localhost:8080"; // Mantero localhost para desenvolvimento

const X_API_KEY_WEB = "1234"; // Certifique-se que esta é a chave que seu backend espera

export const getHeaders = (): Record<string, string> => {
  return {
    "Content-Type": "application/json",
    "x-api-key": X_API_KEY_WEB,
  };
};

