

//  Verifica se o código está rodando no navegador.
// Quando o projeto está na Vercel, isso será um 'true'.
const isBrowser = typeof window !== "undefined";


export const API_BASE_URL = isBrowser
  ? "https://quarkus-gs-production.up.railway.app" // <-- URL PARA PRODUÇÃO
  : "http://localhost:8080";                       // <-- URL PARA DESENVOLVIMENTO LOCAL


const X_API_KEY_WEB = "1234"; 

export const getHeaders = (): Record<string, string> => {
  return {
    "Content-Type": "application/json",
    "x-api-key": X_API_KEY_WEB,
  };
};