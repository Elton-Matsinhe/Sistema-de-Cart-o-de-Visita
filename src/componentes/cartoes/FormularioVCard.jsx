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

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setFotoPreview(result);
        setValue("fotoPerfil", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (dados) => {
    setIsSubmitting(true);
    setErro(null);

    try {
      const dadosCompletos = {
        ...dados,
        fotoPerfil: fotoPreview || dados.fotoPerfil,
        dataCriacao: funcionarioExistente
          ? dados.dataCriacao
          : new Date().toISOString(),
      };

      let resultado;
      if (funcionarioExistente && funcionarioExistente.id) {
        // Atualizar funcionário existente
        resultado = await atualizarFuncionario(
          funcionarioExistente.id,
          dadosCompletos,
        );
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
              pattern: {
                value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))?$/i,
                message: "URL de imagem inválida",
              },
            })}
            type="url"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all mb-3"
            placeholder="https://exemplo.com/foto.jpg"
            onChange={(e) => {
              if (e.target.value.startsWith("http")) {
                setFotoPreview(e.target.value);
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#106a37] file:text-white hover:file:bg-[#0d5a2c]"
            />
            <span className="absolute text-xs text-gray-500 mt-1">
              Formatos aceitos: PNG, JPG, JPEG, GIF, WEBP
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
