'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/authContext';
import { FiAlertTriangle } from 'react-icons/fi';
import CompCabecalhoMural from '../components/CompCabecalhoMural/CompCabecalhoMural';
import ListaDeAlertas from '../components/ListaDeAlertas/ListaDeAlertas';
import { CardData } from '../types/typesAndInterfaces';
import { API_BASE_URL, getHeaders } from '../services/api';
import CompReportarAlerta from '../components/CompReportarAlerta/CompReportarAlerta';
import ModalMessage from '../components/ModalMessage/ModalMessage';

// <-- CORREÇÃO 2: Garantir que o tipo de onConfirm está correto.
type ModalContentState = {
  title: string;
  message: string;
  onConfirm?: (inputValue: string) => void; // Precisa aceitar uma string
  confirmText?: string;
  cancelText: string;
  icon?: 'alert' | 'delete' | 'edit';
  showInput?: boolean;
  inputValue?: string;
  inputPlaceholder?: string;
};

export default function MuralPage() {
  // ... (estados e hooks iniciais sem alteração)
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ModalContentState>({
    title: '',
    message: '',
    cancelText: 'Fechar',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<number | null>(null);
  const [cardToEdit, setCardToEdit] = useState<CardData | null>(null);
  const { isAuthenticated, user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  // ... (funções fetchCards, useEffects, handleLogout sem alteração)
  const fetchCards = useCallback(async () => {
    setIsLoadingCards(true);
    try {
      const response = await fetch(`${API_BASE_URL}/mural`, {
        headers: getHeaders(),
      });
      if (!response.ok) {
        throw new Error('Erro ao buscar alertas');
      }
      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingCards(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchCards();
    }
  }, [authLoading, isAuthenticated, fetchCards]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    if (logout) {
      try {
        await logout();
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
      }
    }
    router.push('/');
  };

  const handleEditCard = (id_MURAL: number) => {
    const card = cards.find(card => card.id_MURAL === id_MURAL);
    if (!user?.id || !card) return;

    if (card.nomeUsuario !== user.nome) {
      setModalContent({
        title: 'Acesso Negado',
        message: 'Você não tem permissão para editar este alerta, pois não é o autor.',
        cancelText: 'Entendi',
        icon: 'alert',
      });
      setIsModalOpen(true);
      return;
    }

    setCardToEdit(card);
    setModalContent({
      title: 'Editar Alerta',
      message: 'Altere a mensagem do seu alerta abaixo:',
      showInput: true,
      inputValue: card.mensagem,
      icon: 'edit',
      confirmText: 'Salvar Alterações',
      cancelText: 'Cancelar',
      inputPlaceholder: 'Digite sua nova mensagem aqui...',
      // <-- CORREÇÃO 1: A função onConfirm deve RECEBER o novo valor do modal
      onConfirm: (novaMensagem: string) => {
        confirmEdit(novaMensagem);
      },
    });
    setIsModalOpen(true);
  };

  const confirmEdit = async (novaMensagem: string) => {
    if (!cardToEdit || !user?.id) return;

    const trimmedMessage = novaMensagem.trim();
    if (trimmedMessage === "") {
      setIsModalOpen(false);
      setModalContent({
        title: "Mensagem Inválida",
        message: "A mensagem não pode estar vazia. Por favor, tente novamente.",
        cancelText: "Fechar",
        icon: 'alert',
      });
      setIsModalOpen(true);
      setCardToEdit(null);
      return;
    }

    setIsModalOpen(false);

    try {
      const response = await fetch(`${API_BASE_URL}/mural/${cardToEdit.id_MURAL}?idUsuario=${user.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ msg: trimmedMessage }),
      });

      if (!response.ok) {
        throw new Error("Erro ao editar o alerta.");
      }

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id_MURAL === cardToEdit.id_MURAL
            ? { ...card, mensagem: trimmedMessage }
            : card
        )
      );

      setModalContent({
        title: "Sucesso!",
        message: "Seu alerta foi editado com sucesso.",
        cancelText: "Ótimo!",
        icon: 'edit', // <-- DICA: Mudei para 'edit' para corresponder à ação.
      });
      setIsModalOpen(true);

    } catch (err) {
      console.error(err);
      setModalContent({
        title: 'Erro na Edição',
        message: 'Não foi possível salvar as alterações. Por favor, tente novamente mais tarde.',
        cancelText: 'Fechar',
        icon: 'alert',
      });
      setIsModalOpen(true);
    } finally {
      setCardToEdit(null);
    }
  };

  const handleDeleteCard = (id_MURAL: number) => {
    const card = cards.find(card => card.id_MURAL === id_MURAL);
    if (!user?.id) return;
    if (card?.nomeUsuario !== user.nome) {
      setModalContent({
        title: 'Acesso Negado',
        message: 'Você não tem permissão para excluir este alerta, pois não é o autor.',
        cancelText: 'Entendi',
        icon: 'alert',
      });
      setIsModalOpen(true);
      return;
    }
    setCardToDelete(id_MURAL);
    setModalContent({
      title: 'Confirmar Exclusão',
      message: 'Você tem certeza que deseja excluir este alerta? Esta ação não pode ser desfeita.',
      // <-- CORREÇÃO 3: Ajustar o onConfirm para não precisar de argumento.
      onConfirm: () => {
        confirmDelete();
      },
      confirmText: 'Sim, Excluir',
      cancelText: 'Cancelar',
      icon: 'delete',
    });
    setIsModalOpen(true);
  };

  // <-- A função confirmDelete não precisa mais de argumento.
  const confirmDelete = async () => {
    if (cardToDelete === null || !user?.id) return;
    setIsModalOpen(false);
    try {
      const response = await fetch(`${API_BASE_URL}/mural/${cardToDelete}?idUsuario=${user.id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Erro ao excluir o alerta.");
      setCards(prev => prev.filter(card => card.id_MURAL !== cardToDelete));
    } catch (err) {
      console.error(err);
      setModalContent({
        title: 'Erro na Exclusão',
        message: 'Não foi possível excluir o alerta. Por favor, tente novamente mais tarde.',
        cancelText: 'Fechar',
        icon: 'alert',
      });
      setIsModalOpen(true);
    } finally {
      setCardToDelete(null);
    }
  };

  // ... (o resto do código, incluindo if(authLoading), if(!isAuthenticated) e o return, permanece o mesmo)
  if (authLoading) { /* ... */ }
  if (!isAuthenticated) { /* ... */ }

  return (
    <>
      <Head>
        <title>Mural - Vulnerable Voices</title>
        <meta name="description" content="Mural de alertas e sugestões de melhoria." />
        <link rel="icon" href="/images/LogoOriginal.png" />
      </Head>

      <ModalMessage
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={modalContent.onConfirm}
        confirmText={modalContent.confirmText}
        cancelText={modalContent.cancelText}
        icon={modalContent.icon}
        showInput={modalContent.showInput}
        inputValue={modalContent.inputValue}
        inputPlaceholder={modalContent.inputPlaceholder}
      />

      <main className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 p-4 sm:p-8">
        { /* ... O resto do seu JSX ... */ }
        <div className="container mx-auto max-w-4xl">
           <CompCabecalhoMural user={user ?? undefined} handleLogout={handleLogout} />
           <CompReportarAlerta user={user} onReportSuccess={fetchCards} />
 
           {isLoadingCards ? (
             <div className="text-center text-gray-500 mt-8">
                {/* ... svg ... */}
               <p className="mt-2">Carregando alertas...</p>
             </div>
           ) : (
            <ListaDeAlertas
               cards={cards}
               onEditCard={handleEditCard}
               onDeleteCard={handleDeleteCard}
             />
           )}
         </div>
         <footer className="text-center mt-16 mb-8 text-gray-500 text-sm">
           <p>&copy; {new Date().getFullYear()} Vulnerable Voices. Todos os direitos reservados.</p>
         </footer>
      </main>
    </>
  );
}