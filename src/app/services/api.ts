// services/api.ts

// A API está rodando apenas localmente por enquanto
export const API_BASE_URL = "http://localhost:8080";

// Sua x-api-key para web (ex: 1234, conforme suas properties Java)
// Se você configurou no .env.local como NEXT_PUBLIC_X_API_KEY:
// const X_API_KEY_WEB = process.env.NEXT_PUBLIC_X_API_KEY || "SUA_CHAVE_API_PADRAO_SE_NAO_DEFINIDA";
// Ou se for fixa por enquanto:
const X_API_KEY_WEB = "1234"; // Certifique-se que esta é a chave que seu backend espera

export const getHeaders = (): Record<string, string> => {
  return {
    "Content-Type": "application/json",
    "x-api-key": X_API_KEY_WEB,
  };
};

// A constante isBrowser não é mais necessária para definir API_BASE
// Se você usava 'isBrowser' para outras coisas neste arquivo, pode mantê-la:
// const isBrowser = typeof window !== "undefined";
// Caso contrário, pode ser removida se só servia para o condicional da URL.