import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiMapPin,
  FiGlobe,
  FiLinkedin,
  FiMessageCircle,
  FiImage,
} from "react-icons/fi";
import { useCartoes } from "../../contextos/CartoesContext";

const FormularioVCard = ({ funcionarioExistente, onSalvar, onCancelar }) => {
  const { adicionarFuncionario, atualizarFuncionario } = useCartoes();
  const [fotoPreview, setFotoPreview] = useState(
    funcionarioExistente?.fotoPerfil || "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState(null);
  const [comprimindoImagem, setComprimindoImagem] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: funcionarioExistente || {
      nomeCompleto: "",
      email: "",
      telefone: "",
      empresa: "",
      cargo: "",
      cidade: "",
      localizacao: "",
      website: "",
      linkedin: "",
      whatsapp: "",
      fotoPerfil: "",
    },
  });

  // Preencher os campos quando existir um funcionário para editar
  useEffect(() => {
    if (funcionarioExistente) {
      Object.keys(funcionarioExistente).forEach((key) => {
        setValue(key, funcionarioExistente[key]);
      });
      setFotoPreview(funcionarioExistente.fotoPerfil || "");
    }
  }, [funcionarioExistente, setValue]);

  // Função para comprimir e redimensionar imagem com verificação de tamanho
  const comprimirImagem = (file, maxWidth = 600, maxHeight = 600, maxSizeKB = 500) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Função auxiliar para calcular tamanho da data URL
          const getDataURLSize = (dataURL) => {
            // Aproximação: base64 é ~33% maior que o arquivo original
            // Remover o prefixo "data:image/jpeg;base64," para contar apenas os dados
            const base64Data = dataURL.split(',')[1] || '';
            return (base64Data.length * 3) / 4 / 1024; // Tamanho em KB
          };

          // Função para comprimir com parâmetros específicos
          const compressWithParams = (width, height, quality) => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            
            // Melhorar qualidade de renderização
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            ctx.drawImage(img, 0, 0, width, height);
            return canvas.toDataURL('image/jpeg', quality);
          };

          // Calcular dimensões iniciais mantendo proporção
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          // Tentar diferentes níveis de qualidade e dimensões até atingir o tamanho desejado
          const qualities = [0.7, 0.5, 0.4, 0.3, 0.25, 0.2];
          let dataURL = null;
          let currentWidth = width;
          let currentHeight = height;
          let bestResult = null;
          let bestSize = Infinity;

          // Tentar diferentes qualidades
          for (const quality of qualities) {
            dataURL = compressWithParams(currentWidth, currentHeight, quality);
            const sizeKB = getDataURLSize(dataURL);
            
            if (sizeKB <= maxSizeKB) {
              resolve(dataURL);
              return;
            }
            
            // Guardar o melhor resultado até agora
            if (sizeKB < bestSize) {
              bestSize = sizeKB;
              bestResult = dataURL;
            }
          }

          // Se ainda não atingiu o tamanho, reduzir dimensões progressivamente
          let reductionFactor = 0.8;
          while (bestSize > maxSizeKB * 1.2 && currentWidth > 200 && currentHeight > 200) {
            currentWidth = Math.round(currentWidth * reductionFactor);
            currentHeight = Math.round(currentHeight * reductionFactor);
            
            // Tentar com qualidade baixa nas novas dimensões
            dataURL = compressWithParams(currentWidth, currentHeight, 0.3);
            const sizeKB = getDataURLSize(dataURL);
            
            if (sizeKB <= maxSizeKB) {
              resolve(dataURL);
              return;
            }
            
            if (sizeKB < bestSize) {
              bestSize = sizeKB;
              bestResult = dataURL;
            }
            
            reductionFactor = 0.9; // Reduzir mais devagar nas próximas iterações
          }

          // Usar o melhor resultado encontrado
          if (bestResult) {
            resolve(bestResult);
          } else {
            resolve(dataURL);
          }
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setComprimindoImagem(true);
        
        // Verificar tamanho do arquivo (máximo 10MB antes de compressão)
        if (file.size > 10 * 1024 * 1024) {
          alert("A imagem é muito grande. Por favor, escolha uma imagem menor que 10MB.");
          setComprimindoImagem(false);
          return;
        }

        // Comprimir e redimensionar a imagem (máximo 500KB após compressão)
        // Reduzir dimensões para 600x600 para garantir menor tamanho
        const compressedImage = await comprimirImagem(file, 600, 600, 500);
        
        // Verificar tamanho final da data URL
        const base64Data = compressedImage.split(',')[1] || '';
        const sizeKB = (base64Data.length * 3) / 4 / 1024;
        
        if (sizeKB > 2000) { // Se ainda for maior que 2MB
          alert("A imagem ainda é muito grande após compressão (" + sizeKB.toFixed(0) + "KB). Por favor, use uma imagem menor ou uma URL externa.");
          setComprimindoImagem(false);
          return;
        }
        
        console.log(`✅ Imagem comprimida: ${sizeKB.toFixed(2)}KB (original: ${(file.size / 1024).toFixed(2)}KB)`);
        
        setFotoPreview(compressedImage);
        setValue("fotoPerfil", compressedImage);
        setComprimindoImagem(false);
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
        alert("Erro ao processar a imagem. Tente novamente.");
        setComprimindoImagem(false);
      }
    }
  };

  const onSubmit = async (dados) => {
    setIsSubmitting(true);
    setErro(null);

    try {
      let dadosCompletos;
      
      if (funcionarioExistente && (funcionarioExistente.id || funcionarioExistente._id)) {
        // Atualizar funcionário existente - remover campos de data e sistema
        const { dataCriacao, createdAt, ultimaAtualizacao, id, _id, ...dadosParaAtualizar } = dados;
        
        // Filtrar apenas campos que têm valores (exceto fotoPerfil que pode ser string vazia)
        const camposAtualizados = {};
        Object.entries(dadosParaAtualizar).forEach(([key, value]) => {
          // Incluir todos os campos que não são undefined/null (permitir strings vazias)
          if (value !== undefined && value !== null) {
            camposAtualizados[key] = value;
          }
        });
        
        // Sempre incluir fotoPerfil se houver fotoPreview ou se foi explicitamente definido
        const fotoParaEnviar = fotoPreview || dados.fotoPerfil;
        if (fotoParaEnviar !== undefined) {
          camposAtualizados.fotoPerfil = fotoParaEnviar;
        }
        
        dadosCompletos = camposAtualizados;
      } else {
        // Criar novo funcionário
        dadosCompletos = {
          ...dados,
          fotoPerfil: fotoPreview || dados.fotoPerfil || "",
          dataCriacao: new Date().toISOString(),
        };
      }

      let resultado;
      if (funcionarioExistente && (funcionarioExistente.id || funcionarioExistente._id)) {
        // Atualizar funcionário existente
        const id = funcionarioExistente.id || funcionarioExistente._id;
        resultado = await atualizarFuncionario(id, dadosCompletos);
      } else {
        // Criar novo funcionário
        resultado = await adicionarFuncionario(dadosCompletos);
      }

      if (onSalvar) {
        onSalvar(resultado);
      }

      if (!funcionarioExistente) {
        reset();
        setFotoPreview("");
      }
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
      setErro(error.message || "Erro ao salvar funcionário. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const limparErro = () => {
    setErro(null);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 animate-fade-in"
    >
      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 animate-slide-down">
          <div className="flex justify-between items-start">
            <p className="text-red-800 text-sm font-medium">{erro}</p>
            <button
              type="button"
              onClick={limparErro}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome Completo */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiUser className="inline mr-2" />
            Nome Completo *
          </label>
          <input
            {...register("nomeCompleto", {
              required: "Nome completo é obrigatório",
              minLength: {
                value: 3,
                message: "Nome deve ter pelo menos 3 caracteres",
              },
            })}
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
            placeholder="Ex: João Silva"
          />
          {errors.nomeCompleto && (
            <p className="text-red-500 text-sm mt-1 animate-fade-in">
              {errors.nomeCompleto.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiMail className="inline mr-2" />
            Email *
          </label>
          <input
            {...register("email", {
              required: "Email é obrigatório",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido",
              },
            })}
            type="email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
            placeholder="exemplo@empresa.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 animate-fade-in">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiPhone className="inline mr-2" />
            Telefone *
          </label>
          <input
            {...register("telefone", {
              required: "Telefone é obrigatório",
              pattern: {
                value: /^[+]?[\d\s\-()]+$/,
                message: "Telefone inválido",
              },
            })}
            type="tel"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
            placeholder="+55 11 99999-9999"
          />
          {errors.telefone && (
            <p className="text-red-500 text-sm mt-1 animate-fade-in">
              {errors.telefone.message}
            </p>
          )}
        </div>

        {/* Empresa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiBriefcase className="inline mr-2" />
            Empresa *
          </label>
          <input
            {...register("empresa", {
              required: "Empresa é obrigatória",
              minLength: {
                value: 2,
                message: "Empresa deve ter pelo menos 2 caracteres",
              },
            })}
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
            placeholder="Nome da Empresa"
          />
          {errors.empresa && (
            <p className="text-red-500 text-sm mt-1 animate-fade-in">
              {errors.empresa.message}
            </p>
          )}
        </div>

        {/* Cargo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiBriefcase className="inline mr-2" />
            Cargo
          </label>
          <input
            {...register("cargo")}
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
            placeholder="Ex: Desenvolvedor Full Stack"
          />
        </div>

        {/* Cidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiMapPin className="inline mr-2" />
            Cidade
          </label>
          <input
            {...register("cidade")}
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
            placeholder="Ex: São Paulo"
          />
        </div>

        {/* Localização */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiMapPin className="inline mr-2" />
            Localização
          </label>
          <input
            {...register("localizacao")}
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
            placeholder="Ex: Av. Paulista, 1000"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiGlobe className="inline mr-2" />
            Website
          </label>
          <input
            {...register("website", {
              pattern: {
                value:
                  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i,
                message: "URL inválida",
              },
            })}
            type="url"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
            placeholder="https://www.exemplo.com"
          />
          {errors.website && (
            <p className="text-red-500 text-sm mt-1 animate-fade-in">
              {errors.website.message}
            </p>
          )}
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiLinkedin className="inline mr-2" />
            LinkedIn
          </label>
          <input
            {...register("linkedin", {
              pattern: {
                value:
                  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i,
                message: "URL inválida",
              },
            })}
            type="url"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
            placeholder="https://linkedin.com/in/usuario"
          />
          {errors.linkedin && (
            <p className="text-red-500 text-sm mt-1 animate-fade-in">
              {errors.linkedin.message}
            </p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiMessageCircle className="inline mr-2" />
            WhatsApp
          </label>
          <input
            {...register("whatsapp", {
              pattern: {
                value: /^[+]?[\d\s\-()]+$/,
                message: "Número inválido",
              },
            })}
            type="tel"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
            placeholder="+55 11 99999-9999"
          />
          {errors.whatsapp && (
            <p className="text-red-500 text-sm mt-1 animate-fade-in">
              {errors.whatsapp.message}
            </p>
          )}
        </div>

        {/* Foto de Perfil */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiImage className="inline mr-2" />
            Foto de Perfil (URL ou Upload)
          </label>
          <input
            {...register("fotoPerfil", {
              validate: (value) => {
                // Permitir vazio, URLs HTTP/HTTPS ou data URLs (base64)
                if (!value || value.trim() === "") return true;
                if (value.startsWith("data:image/")) return true; // Data URL (imagem local)
                if (value.startsWith("http://") || value.startsWith("https://")) {
                  // Validar se é uma URL de imagem válida
                  return /\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i.test(value) || true;
                }
                return "URL de imagem inválida. Use uma URL HTTP/HTTPS ou faça upload de uma imagem.";
              },
            })}
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all mb-3"
            placeholder="https://exemplo.com/foto.jpg ou faça upload abaixo"
            onChange={(e) => {
              const valor = e.target.value;
              // Atualizar preview se for URL HTTP ou data URL
              if (valor.startsWith("http") || valor.startsWith("data:image/")) {
                setFotoPreview(valor);
                setValue("fotoPerfil", valor);
              }
            }}
          />
          {errors.fotoPerfil && (
            <p className="text-red-500 text-sm mt-1 animate-fade-in">
              {errors.fotoPerfil.message}
            </p>
          )}

          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              disabled={comprimindoImagem}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#106a37] file:text-white hover:file:bg-[#0d5a2c] disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="absolute text-xs text-gray-500 mt-1">
              {comprimindoImagem ? (
                <span className="text-[#106a37] font-medium">Comprimindo imagem... Aguarde</span>
              ) : (
                "Formatos aceitos: PNG, JPG, JPEG, GIF, WEBP (será comprimido automaticamente)"
              )}
            </span>
          </div>

          {fotoPreview && (
            <div className="mt-4 flex flex-col items-center">
              <img
                src={fotoPreview}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#106a37] shadow-lg"
                onError={() => {
                  setFotoPreview("");
                  setValue("fotoPerfil", "");
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setFotoPreview("");
                  setValue("fotoPerfil", "");
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Remover foto
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="relative px-6 py-3 rounded-lg bg-gradient-to-r from-[#106a37] to-[#0d5a2f] text-white transition-all duration-300 ease-out font-medium shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.03] hover:from-[#17a05a] hover:to-[#0f7a3e] active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#106a37]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {funcionarioExistente ? "Atualizando..." : "Salvando..."}
            </span>
          ) : funcionarioExistente ? (
            "Atualizar Funcionário"
          ) : (
            "Salvar Funcionário"
          )}
        </button>
      </div>
    </form>
  );
};

export default FormularioVCard;
