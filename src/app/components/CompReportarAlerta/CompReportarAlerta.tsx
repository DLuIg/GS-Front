import { API_BASE_URL } from "@/app/services/api";
import { User } from "@/app/types/typesAndInterfaces";

import { useState, FormEvent } from "react";
import { FiMapPin, FiMessageSquare, FiAlertTriangle, FiPlusCircle } from "react-icons/fi";

interface Props {
  user: User | null;
  onReportSuccess: () => Promise<void>;
}


export default function CompReportarAlerta({ user, onReportSuccess }: Props) {
  const [newLocation, setNewLocation] = useState('');
  const [newImprovementPoints, setNewImprovementPoints] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  

  
  
  console.log(user)
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    setFormError(null);
    setFetchError(null);
    

    if (!newLocation.trim() || !newImprovementPoints.trim()) {
      setFormError('Todos os campos são obrigatórios.');
      return;
    }

    if (!user?.id) {
      setFormError('Usuário não autenticado.');
      return;
    }

    if (onReportSuccess) {
      await onReportSuccess();
    }

    setIsSubmitting(true);

    
    try {
      
      const response = await fetch(`${API_BASE_URL}/mural`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '1234'
        },
        body: JSON.stringify({
          localizacao: newLocation,
          mensagem: newImprovementPoints,
          id_usuario: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status} ao enviar dados`);
      }
      if (onReportSuccess) {
      onReportSuccess();  // avisa o pai para atualizar os dados
    }

      const data = await response.json();

      console.log('Dados enviados com sucesso:', data);

      // Limpa os campos após o sucesso
      setNewLocation('');
      setNewImprovementPoints('');
    } catch (error: any) {
      console.error(error);
      setFetchError(error.message || "Erro ao enviar dados");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mb-12 bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
        <FiPlusCircle className="mr-3 text-orange-500 h-7 w-7" />
        Adicionar Novo Alerta
      </h2>

      {fetchError && <p className="text-red-600">{fetchError}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Localização (Bairro, Rua, Ponto de Referência)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="location"
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150"
              placeholder="Ex: Rua das Palmeiras, Bairro Esperança"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="improvementPoints" className="block text-sm font-medium text-gray-700 mb-1">
            Pontos a Serem Melhorados / Alertas
          </label>
          <div className="relative">
            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
              <FiMessageSquare className="h-5 w-5 text-gray-400 mt-0.5" />
            </div>
            <textarea
              id="improvementPoints"
              value={newImprovementPoints}
              onChange={(e) => setNewImprovementPoints(e.target.value)}
              rows={5}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150"
              placeholder="Descreva as sugestões, problemas ou alertas para esta localização..."
              required
            />
          </div>
        </div>

        {formError && (
          <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md flex items-center">
            <FiAlertTriangle className="h-5 w-5 mr-2 text-red-500 shrink-0" />
            {formError}
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-transform transform hover:scale-105 duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <FiPlusCircle className="mr-2 h-5 w-5" />
            )}
            {isSubmitting ? "Publicando..." : "Publicar no Mural"}
          </button>
        </div>
      </form>
    </section>
  );
}
