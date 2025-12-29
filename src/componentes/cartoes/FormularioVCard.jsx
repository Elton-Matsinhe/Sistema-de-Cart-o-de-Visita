import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  FiUser, FiMail, FiPhone, FiBriefcase, FiMapPin, 
  FiGlobe, FiLinkedin, FiMessageCircle, FiImage 
} from 'react-icons/fi';
import { useCartoes } from '../../contextos/CartoesContext';

const FormularioVCard = ({ funcionarioExistente, onSalvar, onCancelar }) => {
  const { adicionarFuncionario, atualizarFuncionario } = useCartoes();
  const [fotoPreview, setFotoPreview] = useState(funcionarioExistente?.fotoPerfil || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: funcionarioExistente || {
      nomeCompleto: '',
      email: '',
      telefone: '',
      empresa: '',
      cargo: '',
      cidade: '',
      localizacao: '',
      website: '',
      linkedin: '',
      whatsapp: '',
      fotoPerfil: '',
    },
  });

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (dados) => {
    setIsSubmitting(true);
    try {
      const dadosCompletos = {
        ...dados,
        fotoPerfil: fotoPreview || dados.fotoPerfil,
      };

      if (funcionarioExistente) {
        atualizarFuncionario(funcionarioExistente.id, dadosCompletos);
      } else {
        adicionarFuncionario(dadosCompletos);
      }

      if (onSalvar) {
        onSalvar(dadosCompletos);
      }

      if (!funcionarioExistente) {
        reset();
        setFotoPreview('');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome Completo */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiUser className="inline mr-2" />
            Nome Completo *
          </label>
          <input
            {...register('nomeCompleto', { required: 'Nome completo é obrigatório' })}
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Ex: João Silva"
          />
          {errors.nomeCompleto && (
            <p className="text-red-500 text-sm mt-1">{errors.nomeCompleto.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiMail className="inline mr-2" />
            Email *
          </label>
          <input
            {...register('email', {
              required: 'Email é obrigatório',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido',
              },
            })}
            type="email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="exemplo@empresa.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiPhone className="inline mr-2" />
            Telefone *
          </label>
          <input
            {...register('telefone', { required: 'Telefone é obrigatório' })}
            type="tel"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="+55 11 99999-9999"
          />
          {errors.telefone && (
            <p className="text-red-500 text-sm mt-1">{errors.telefone.message}</p>
          )}
        </div>

        {/* Empresa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiBriefcase className="inline mr-2" />
            Empresa *
          </label>
          <input
            {...register('empresa', { required: 'Empresa é obrigatória' })}
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Nome da Empresa"
          />
          {errors.empresa && (
            <p className="text-red-500 text-sm mt-1">{errors.empresa.message}</p>
          )}
        </div>

        {/* Cargo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiBriefcase className="inline mr-2" />
            Cargo
          </label>
          <input
            {...register('cargo')}
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            {...register('cidade')}
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            {...register('localizacao')}
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            {...register('website')}
            type="url"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="https://www.exemplo.com"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiLinkedin className="inline mr-2" />
            LinkedIn
          </label>
          <input
            {...register('linkedin')}
            type="url"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="https://linkedin.com/in/usuario"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiMessageCircle className="inline mr-2" />
            WhatsApp
          </label>
          <input
            {...register('whatsapp')}
            type="tel"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="+55 11 99999-9999"
          />
        </div>

        {/* Foto de Perfil */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiImage className="inline mr-2" />
            Foto de Perfil (URL ou Upload)
          </label>
          <input
            {...register('fotoPerfil')}
            type="url"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-3"
            placeholder="https://exemplo.com/foto.jpg"
            onChange={(e) => {
              if (e.target.value.startsWith('http')) {
                setFotoPreview(e.target.value);
              }
            }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {fotoPreview && (
            <div className="mt-4 flex justify-center">
              <img
                src={fotoPreview}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                onError={() => setFotoPreview('')}
              />
            </div>
          )}
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-4 justify-end pt-4">
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#106a37] to-[#0d5a2f] text-white transition-all duration-300 ease-out font-medium shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.03] hover:from-[#17a05a] hover:to-[#0f7a3e] active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#106a37]/40 disabled:opacity-50 disabled:cursor-not-allowed"

        >
          {isSubmitting ? 'Salvando...' : funcionarioExistente ? 'Atualizar' : 'Salvar Funcionário'}
        </button>
      </div>
    </form>
  );
};

export default FormularioVCard;

