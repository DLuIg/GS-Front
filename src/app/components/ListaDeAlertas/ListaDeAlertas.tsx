import { CardData, User } from "@/app/types/typesAndInterfaces";
import CardAlerta from "../CompCardAlerta/CompCardAlerta";






interface ListaDeAlertasProps {
  cards: CardData[];
  onEditCard: (id: number) => void;
  onDeleteCard: (id: number) => void;
}



export default function ListaDeAlertas({
  cards,
  onEditCard,
  onDeleteCard,
}: ListaDeAlertasProps) {
  if (cards.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">
        Nenhum alerta disponível no momento.
      </p>
    );
  }

  return (
    <div className="mt-10 space-y-6">
      {cards.map((card) => (
        <CardAlerta  key={card.id_MURAL}
          card={card}
          onEditCard={onEditCard}
          onDeleteCard={onDeleteCard} />
      ))}
    </div>
  );
}
