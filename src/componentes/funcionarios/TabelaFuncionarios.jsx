import React from 'react';
import CartaoFuncionario from './CartaoFuncionario';

const TabelaFuncionarios = ({ funcionarios, onEditar, onVerQRCode }) => {
  if (funcionarios.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-lg">
        <p className="text-gray-500 text-lg mb-2">Nenhum funcionário cadastrado</p>
        <p className="text-gray-400 text-sm">Comece adicionando seu primeiro funcionário!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {funcionarios.map((funcionario) => (
        <CartaoFuncionario
          key={funcionario.id}
          funcionario={funcionario}
          onEditar={onEditar}
          onVerQRCode={onVerQRCode}
        />
      ))}
    </div>
  );
};

export default TabelaFuncionarios;

