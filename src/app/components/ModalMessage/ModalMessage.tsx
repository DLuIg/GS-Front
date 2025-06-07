'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
// 1. Importar o novo ícone
import { FiX, FiAlertTriangle, FiTrash2, FiEdit } from 'react-icons/fi';


if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

interface ModalMessageProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  message: string;
  
  onConfirm?: (inputValue: string) => void;
  confirmText?: string;
  cancelText?: string;
  
  icon?: 'alert' | 'delete' | 'edit';
  showInput?: boolean;
  inputValue?: string;
  inputPlaceholder?: string;
}

const ModalMessage: React.FC<ModalMessageProps> = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  icon,
  
  showInput = false,
  inputValue = '',
  inputPlaceholder = 'Digite aqui...'
}) => {
  // 5. Criar um estado interno para o campo de texto
  const [internalInputValue, setInternalInputValue] = useState('');

  // Sincronizar o estado interno quando a prop 'inputValue' mudar (ao abrir o modal)
  useEffect(() => {
    if (isOpen) {
      setInternalInputValue(inputValue);
    }
  }, [isOpen, inputValue]);

  // Função para lidar com a confirmação
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(internalInputValue);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      overlayClassName="fixed inset-0 bg-slate-900/70 z-40"
      contentLabel={title}
      ariaHideApp={false} // Desativar a acessibilidade para evitar erros de foco
      closeTimeoutMS={200} // Tempo de transição para fechar o modal
    >
      <div className="bg-gradient-to-br from-slate-100 to-sky-100 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md mx-auto relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          aria-label="Fechar Modal"
        >
          <FiX size={24} />
        </button>

        <div className="flex flex-col items-center text-center w-full">
            {icon === 'alert' && <FiAlertTriangle className="h-16 w-16 text-red-500 mb-4" />}
            {icon === 'delete' && <FiTrash2 className="h-16 w-16 text-orange-500 mb-4" />}
            {/* 6. Adicionar o novo ícone de edição */}
            {icon === 'edit' && <FiEdit className="h-16 w-16 text-sky-600 mb-4" />}

            <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
            <p className="text-gray-600 mb-4">{message}</p> {/* Diminuí a margem inferior */}
            
            {/* 7. Renderizar o <textarea> condicionalmente */}
            {showInput && (
              <textarea
                value={internalInputValue}
                onChange={(e) => setInternalInputValue(e.target.value)}
                placeholder={inputPlaceholder}
                className="w-full h-24 p-2 mb-6 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition text-black"
                rows={3}
              />
            )}
        </div>

        <div className="flex justify-center gap-4">
          {onConfirm && (
            <button
              onClick={handleConfirm} // Usar o novo manipulador
              className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer"
            >
              {confirmText}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalMessage;