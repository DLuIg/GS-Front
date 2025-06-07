"use client";

import { User } from "@/app/types/typesAndInterfaces";
import { FiLogOut } from "react-icons/fi";


type CabecalhoMuralProps = {
  user?: User | null;
  handleLogout?: () => void;
};


export default function CabecalhoMural({ user, handleLogout }: CabecalhoMuralProps) {
  return (
    <header className="mb-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-orange-500">
            Vulnerable Voices
          </h1>
          <p className="text-xl text-gray-600 mt-2">Mural de Alertas e Melhorias Comunitárias</p>
        </div>
        {user && (
          <button
            onClick={handleLogout}
            className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150 ease-in-out"
          >
            <FiLogOut className="mr-2 h-5 w-5" />
            Logout
          </button>
        )}
      </div>
      {user && (
        <div className="text-center sm:text-left border-t border-gray-300 pt-4 mt-4">
          <p className="text-md text-gray-500">Bem-vindo(a), {user?.nome || 'Usuário'}!</p>
        </div>
      )}
    </header>
  );
}
