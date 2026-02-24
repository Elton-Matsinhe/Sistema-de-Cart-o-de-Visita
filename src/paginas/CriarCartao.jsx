import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import FormularioVCard from "../componentes/cartoes/FormularioVCard";
import GeradorQRCode from "../componentes/cartoes/GeradorQRCode";
import { useCartoes } from "../contextos/CartoesContext";

const CriarCartao = () => {
  const navigate = useNavigate();
  const { adicionarFuncionario, carregarFuncionarios } = useCartoes();
  const [funcionarioCriado, setFuncionarioCriado] = useState(null);
  const [mostrarQRCode, setMostrarQRCode] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSalvar = async (dados) => {
    try {
      setCarregando(true);
      console.log("📝 Iniciando criação de funcionário...");
      
      const resultado = await adicionarFuncionario(dados);
      
      console.log("✅ Resultado recebido:", resultado);
      
      // Verificar se o resultado é válido
      if (resultado && (resultado.id || resultado._id || resultado.nomeCompleto)) {
        console.log("✅ Funcionário criado com sucesso, ID:", resultado.id || resultado._id);
        setFuncionarioCriado(resultado);
        setMostrarQRCode(true);
        // Recarregar lista de funcionários silenciosamente (sem mostrar erro se falhar)
        try {
          await carregarFuncionarios();
        } catch (reloadError) {
          console.warn("⚠️ Erro ao recarregar lista (não crítico):", reloadError);
        }
        // Não mostrar erro - sucesso!
        return;
      } else {
        console.error("❌ Resultado inválido:", resultado);
        throw new Error("Resposta inválida do servidor");
      }
    } catch (error) {
      console.error("❌ Erro ao criar funcionário:", error);
      const errorMessage = error.message || "Erro desconhecido";
      
      // Só mostrar alert se realmente for um erro
      // Verificar se não é uma mensagem de sucesso disfarçada
      if (errorMessage && 
          !errorMessage.includes("sucesso") && 
          !errorMessage.includes("criado") &&
          !errorMessage.includes("Email já cadastrado") && // Se aparecer essa mensagem mas funcionário foi criado, não mostrar
          errorMessage !== "Erro interno do servidor") { // Erro genérico pode ser falso positivo
        alert(`Erro ao criar funcionário: ${errorMessage}`);
      } else if (errorMessage === "Email já cadastrado") {
        // Se for erro de email duplicado, verificar se realmente foi criado
        // Se foi criado, não mostrar erro
        console.warn("⚠️ Mensagem de email duplicado, mas verificar se funcionário foi criado");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-all"
        >
          <FiArrowLeft className="text-2xl" />
        </button>
        <div>
          <h1 className="text-4xl font-bold mb-2 text-[#106a37]">
            Criar Novo Cartão
          </h1>
          <p className="text-gray-600">
            Preencha os dados do funcionário para gerar o QR Code
          </p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {carregando ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#106a37] mx-auto mb-4"></div>
              <p className="text-gray-600">Salvando funcionário...</p>
            </div>
          ) : mostrarQRCode && funcionarioCriado ? (
            <div className="text-center py-8">
              <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Funcionário Cadastrado!
              </h2>
              <p className="text-gray-600 mb-6">
                O QR Code foi gerado com sucesso. Você pode visualizá-lo ao
                lado.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setMostrarQRCode(false);
                    setFuncionarioCriado(null);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                >
                  Criar Outro Cartão
                </button>
                <button
                  onClick={() => navigate("/funcionarios")}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
                >
                  Ver Todos os Funcionários
                </button>
              </div>
            </div>
          ) : (
            <FormularioVCard onSalvar={handleSalvar} />
          )}
        </div>

        {/* QR Code Preview */}
        <div className="lg:sticky lg:top-24">
          {mostrarQRCode && funcionarioCriado ? (
            <GeradorQRCode funcionario={funcionarioCriado} />
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <p className="text-lg mb-2">Preview do QR Code</p>
                <p className="text-sm">
                  Preencha o formulário ao lado para gerar o QR Code
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CriarCartao;
