import React, { createContext, useContext, useState, useEffect } from 'react';

const CartoesContext = createContext();

export const useCartoes = () => {
  const context = useContext(CartoesContext);
  if (!context) {
    throw new Error('useCartoes deve ser usado dentro de CartoesProvider');
  }
  return context;
};

export const CartoesProvider = ({ children }) => {
  const [funcionarios, setFuncionarios] = useState(() => {
    const salvos = localStorage.getItem('funcionarios');
    return salvos ? JSON.parse(salvos) : [];
  });

  useEffect(() => {
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
  }, [funcionarios]);

  const adicionarFuncionario = (dados) => {
    const novoFuncionario = {
      id: Date.now().toString(),
      ...dados,
      dataCriacao: new Date().toISOString(),
    };
    setFuncionarios([...funcionarios, novoFuncionario]);
    return novoFuncionario;
  };

  const atualizarFuncionario = (id, dadosAtualizados) => {
    setFuncionarios(
      funcionarios.map((func) =>
        func.id === id ? { ...func, ...dadosAtualizados } : func
      )
    );
  };

  const excluirFuncionario = (id) => {
    setFuncionarios(funcionarios.filter((func) => func.id !== id));
  };

  const obterFuncionario = (id) => {
    return funcionarios.find((func) => func.id === id);
  };

  const valor = {
    funcionarios,
    adicionarFuncionario,
    atualizarFuncionario,
    excluirFuncionario,
    obterFuncionario,
    totalFuncionarios: funcionarios.length,
  };

  return (
    <CartoesContext.Provider value={valor}>
      {children}
    </CartoesContext.Provider>
  );
};

