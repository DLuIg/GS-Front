import { CardData } from '@/app/types/typesAndInterfaces';
import { FiClock, FiEdit, FiMapPin, FiTrash2, FiUser } from 'react-icons/fi';

interface CardProps {
  card: CardData;
  onEditCard: (id: number) => void;
  onDeleteCard: (id: number) => void;
}





 const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
const CardAlerta = ({ card, onEditCard, onDeleteCard }: CardProps) => {
  return (
    <article className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
      {/* Cabeçalho do Card: Localização e Ícones de Ação */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-blue-700 flex items-center mr-2">
          <FiMapPin className="mr-2 text-blue-500 h-6 w-6 flex-shrink-0" />
          {card.localizacao}
        </h3>

        {/* Ícones de Ação (Editar e Excluir) */}
        <div className="flex space-x-2 flex-shrink-0">
          <button
            onClick={() => onEditCard(card.id_MURAL)}
            title="Editar alerta"
            className="p-1.5 text-orange-500 hover:text-orange-700 hover:bg-orange-100 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <FiEdit className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDeleteCard(card.id_MURAL)}
            title="Excluir alerta"
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <FiTrash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <p className="text-gray-700 whitespace-pre-wrap mb-4 leading-relaxed">
        {card.mensagem}
      </p>

      {/* Rodapé do Card: Informações do Autor e Data */}
      <div className="border-t border-gray-200 pt-3 mt-4 text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-2 sm:mb-0">
          <FiUser className="mr-2 h-4 w-4 text-gray-400" />
          Postado por: <strong className="ml-1 text-gray-600">{card.nomeUsuario}</strong>
        </div>
        <div className="flex items-center">
          <FiClock className="mr-2 h-4 w-4 text-gray-400" />
          Em: {formatDate(card.dateTime)}
        </div>
      </div>
    </article>
  );
};

export default CardAlerta;
