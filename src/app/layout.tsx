// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Mantendo suas fontes Geist
import "./globals.css"
import { AuthProvider } from './contexts/authContext'; // 1. IMPORTADO AQUI (caminho corrigido)

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Você pode ajustar os metadados conforme o seu projeto "Vulnerable Voices"
export const metadata: Metadata = {
  title: "Vulnerable Voices", // Ajustado
  description: "Plataforma Vulnerable Voices", // Ajustado
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Ajuste o lang se necessário, pt-BR é comum para projetos brasileiros
    <html lang="pt-BR"> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider> {/* 2. USADO AQUI, ENVOLVENDO OS FILHOS */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}