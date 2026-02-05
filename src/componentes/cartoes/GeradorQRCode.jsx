import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  FiDownload,
  FiCopy,
  FiCheck,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiMapPin,
  FiGlobe,
  FiMessageCircle,
  FiSmartphone,
  FiShare2,
  FiLink,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import {
  gerarVCard,
  gerarVCardURI,
  downloadVCard,
  gerarMeCard,
} from "../../utils/geradorVCard";

const GeradorQRCode = ({ funcionario }) => {
  const [copiado, setCopiado] = useState(false);
  const [qrTipo, setQrTipo] = useState("vcard"); // vcard ou mecard
  const [loading, setLoading] = useState(false);
  const [qrCor, setQrCor] = useState("#106a37");
  const svgRef = useRef(null);

  if (!funcionario) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg">
        <FiUser className="text-6xl text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg mb-2">
          Nenhum funcionário selecionado
        </p>
        <p className="text-gray-400 text-sm">
          Selecione um funcionário para gerar o QR Code
        </p>
      </div>
    );
  }

  // Função para sanitizar dados para QR Code
  const sanitizarDados = (dados) => {
    return {
      ...dados,
      nomeCompleto: dados.nomeCompleto || "",
      email: dados.email || "",
      telefone: dados.telefone || "",
      empresa: dados.empresa || "",
      cargo: dados.cargo || "",
      cidade: dados.cidade || "",
      localizacao: dados.localizacao || "",
      website: dados.website || "",
      linkedin: dados.linkedin || "",
      whatsapp: dados.whatsapp || "",
      fotoPerfil: dados.fotoPerfil || "",
    };
  };

  // Escolher qual tipo de QR Code gerar
  const getQRValue = () => {
    const dadosSanitizados = sanitizarDados(funcionario);

    if (qrTipo === "mecard") {
      return gerarMeCard(dadosSanitizados);
    }
    return gerarVCard(dadosSanitizados);
  };

  const qrValue = getQRValue();
  const vcardTexto = gerarVCard(sanitizarDados(funcionario));

  const handleDownloadQRCode = async () => {
    try {
      setLoading(true);
      const svgElement = svgRef.current?.querySelector("svg");
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        // Aumentar a resolução para melhor qualidade
        const scale = 4;
        canvas.width = 280 * scale;
        canvas.height = 280 * scale;
        ctx.scale(scale, scale);

        img.onload = () => {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale);
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.download = `qrcode-${(funcionario.nomeCompleto || "contato").replace(/\s+/g, "-").toLowerCase()}.png`;
              link.href = url;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            },
            "image/png",
            1.0,
          );
        };

        img.src =
          "data:image/svg+xml;base64," +
          btoa(unescape(encodeURIComponent(svgData)));
      }
    } catch (error) {
      console.error("Erro ao baixar QR Code:", error);
      alert("Erro ao baixar QR Code. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopiarVCard = async () => {
    try {
      await navigator.clipboard.writeText(vcardTexto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
      // Fallback para navegadores antigos
      const textArea = document.createElement("textarea");
      textArea.value = vcardTexto;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        if (successful) {
          setCopiado(true);
          setTimeout(() => setCopiado(false), 3000);
        } else {
          alert("Não foi possível copiar o vCard. Tente baixar o arquivo.");
        }
      } catch (err2) {
        console.error("Fallback copy error:", err2);
        alert("Erro ao copiar vCard. Use o botão de download.");
      }

      document.body.removeChild(textArea);
    }
  };

  const handleDownloadVCard = () => {
    try {
      downloadVCard(sanitizarDados(funcionario));
    } catch (error) {
      console.error("Erro ao baixar vCard:", error);
      alert("Erro ao baixar vCard. Tente novamente.");
    }
  };

  const handleCompartilhar = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Contato - ${funcionario.nomeCompleto || "Funcionário"}`,
          text: `Adicione ${funcionario.nomeCompleto || "este contato"} aos seus contatos`,
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Erro ao compartilhar:", error);
          handleCopiarVCard();
        }
      }
    } else {
      handleCopiarVCard();
      if (!copiado) {
        setTimeout(() => {
          alert(
            "vCard copiado para área de transferência! Cole em um arquivo .vcf para importar.",
          );
        }, 100);
      }
    }
  };

  const handleCopiarLinkQR = async () => {
    try {
      const vcardURI = gerarVCardURI(sanitizarDados(funcionario));
      await navigator.clipboard.writeText(vcardURI);
      alert("Link do QR Code copiado!");
    } catch (error) {
      console.error("Erro ao copiar link:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 lg:p-8 animate-scale-in">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-[#106a37] mb-2">
          QR Code do Cartão
        </h3>
        <p className="text-gray-600">
          Escaneie para adicionar {funcionario.nomeCompleto || "este contato"}{" "}
          aos seus contatos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Code e Ações */}
        <div className="space-y-6">
          {/* QR Code */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
            <div className="flex justify-center mb-4">
              <div
                className="p-4 bg-white rounded-lg border border-gray-200"
                ref={svgRef}
              >
                <QRCodeSVG
                  value={qrValue}
                  size={240}
                  level="H"
                  includeMargin={true}
                  fgColor={qrCor}
                  bgColor="#ffffff"
                  imageSettings={
                    funcionario.fotoPerfil
                      ? {
                          src: funcionario.fotoPerfil,
                          x: undefined,
                          y: undefined,
                          height: 40,
                          width: 40,
                          excavate: true,
                        }
                      : undefined
                  }
                />
              </div>
            </div>

            {/* Configurações do QR Code */}
            <div className="space-y-4">
              {/* Seletor de Tipo de QR Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de QR Code
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setQrTipo("vcard")}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      qrTipo === "vcard"
                        ? "bg-[#106a37] text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    vCard (Universal)
                  </button>
                  <button
                    onClick={() => setQrTipo("mecard")}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      qrTipo === "mecard"
                        ? "bg-[#106a37] text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    MECARD (Android)
                  </button>
                </div>
              </div>

              {/* Seletor de Cor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor do QR Code
                </label>
                <div className="flex gap-2">
                  {["#106a37", "#000000", "#1e40af", "#7c3aed", "#dc2626"].map(
                    (cor) => (
                      <button
                        key={cor}
                        onClick={() => setQrCor(cor)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          qrCor === cor ? "border-gray-800" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: cor }}
                        title={
                          cor === "#106a37"
                            ? "Verde padrão"
                            : cor === "#000000"
                              ? "Preto"
                              : cor === "#1e40af"
                                ? "Azul"
                                : cor === "#7c3aed"
                                  ? "Roxo"
                                  : "Vermelho"
                        }
                      />
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Informações do QR Code */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                <strong>Tipo:</strong>{" "}
                {qrTipo === "vcard" ? "vCard 3.0" : "MECARD"}
              </p>
              <p className="text-center text-xs text-gray-500 mt-1">
                {qrTipo === "vcard"
                  ? "Compatível com iPhone, Android e outros dispositivos"
                  : "Otimizado para dispositivos Android"}
              </p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadQRCode}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#106a37] text-white rounded-lg hover:bg-[#0d5a2c] transition-all shadow hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <FiRefreshCw className="animate-spin" />
              ) : (
                <FiDownload />
              )}
              {loading ? "Processando..." : "Baixar QR"}
            </button>

            <button
              onClick={handleDownloadVCard}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#106a37] text-[#106a37] rounded-lg hover:bg-[#106a37]/10 transition-all font-medium"
            >
              <FiDownload />
              Baixar vCard
            </button>

            <button
              onClick={handleCopiarVCard}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                copiado
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {copiado ? <FiCheck className="text-green-500" /> : <FiCopy />}
              {copiado ? "Copiado!" : "Copiar vCard"}
            </button>

            <button
              onClick={handleCompartilhar}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              <FiShare2 />
              Compartilhar
            </button>

            <button
              onClick={handleCopiarLinkQR}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium col-span-2"
            >
              <FiLink />
              Copiar Link do QR Code
            </button>
          </div>
        </div>

        {/* Informações do Funcionário */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
          <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <FiUser className="text-[#106a37]" />
            Informações do Contato
          </h4>

          <div className="space-y-3">
            {/* Nome */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
              <div className="w-10 h-10 bg-[#106a37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiUser className="text-[#106a37]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-medium text-gray-800 truncate">
                  {funcionario.nomeCompleto || "Não informado"}
                </p>
              </div>
            </div>

            {/* Empresa */}
            {funcionario.empresa && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                <div className="w-10 h-10 bg-[#106a37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiBriefcase className="text-[#106a37]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-600">Empresa</p>
                  <p className="font-medium text-gray-800 truncate">
                    {funcionario.empresa}
                  </p>
                </div>
              </div>
            )}

            {/* Cargo */}
            {funcionario.cargo && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                <div className="w-10 h-10 bg-[#106a37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiBriefcase className="text-[#106a37]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-600">Cargo</p>
                  <p className="font-medium text-gray-800 truncate">
                    {funcionario.cargo}
                  </p>
                </div>
              </div>
            )}

            {/* Email */}
            {funcionario.email && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                <div className="w-10 h-10 bg-[#106a37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-[#106a37]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-600">Email</p>
                  <a
                    href={`mailto:${funcionario.email}`}
                    className="font-medium text-[#106a37] hover:text-[#0d5a2c] truncate block"
                  >
                    {funcionario.email}
                  </a>
                </div>
              </div>
            )}

            {/* Telefone */}
            {funcionario.telefone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                <div className="w-10 h-10 bg-[#106a37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiPhone className="text-[#106a37]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-600">Telefone</p>
                  <a
                    href={`tel:${funcionario.telefone.replace(/\s+/g, "")}`}
                    className="font-medium text-[#106a37] hover:text-[#0d5a2c] truncate block"
                  >
                    {funcionario.telefone}
                  </a>
                </div>
              </div>
            )}

            {/* Website */}
            {funcionario.website && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                <div className="w-10 h-10 bg-[#106a37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiGlobe className="text-[#106a37]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-600">Website</p>
                  <a
                    href={
                      funcionario.website.startsWith("http")
                        ? funcionario.website
                        : `https://${funcionario.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#106a37] hover:text-[#0d5a2c] truncate block"
                  >
                    {funcionario.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              </div>
            )}

            {/* Localização */}
            {(funcionario.localizacao || funcionario.cidade) && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                <div className="w-10 h-10 bg-[#106a37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-[#106a37]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-600">Localização</p>
                  <p className="font-medium text-gray-800 truncate">
                    {[funcionario.localizacao, funcionario.cidade]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
            )}

            {/* WhatsApp */}
            {funcionario.whatsapp && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                <div className="w-10 h-10 bg-[#106a37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMessageCircle className="text-[#106a37]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-600">WhatsApp</p>
                  <a
                    href={`https://wa.me/${funcionario.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#106a37] hover:text-[#0d5a2c] truncate block"
                  >
                    {funcionario.whatsapp}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Status do Funcionário */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status:</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Ativo
              </span>
            </div>
            {funcionario.dataCriacao && (
              <div className="mt-2 text-sm text-gray-600">
                Criado em:{" "}
                {new Date(funcionario.dataCriacao).toLocaleDateString("pt-BR")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
        <h4 className="font-bold text-lg text-blue-800 mb-3 flex items-center gap-2">
          <FiSmartphone className="text-blue-600" />
          Como usar o QR Code
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-white rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
            <p className="font-medium text-gray-800">Escaneie o código</p>
            <p className="text-sm text-gray-600 mt-1">
              Use a câmera do seu celular para escanear o QR Code
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-blue-600 mb-2">2</div>
            <p className="font-medium text-gray-800">Toque na notificação</p>
            <p className="text-sm text-gray-600 mt-1">
              Clique no link que aparecer na tela após a leitura
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
            <p className="font-medium text-gray-800">Salve o contato</p>
            <p className="text-sm text-gray-600 mt-1">
              Adicione às suas listas de contatos automaticamente
            </p>
          </div>
        </div>

        {/* Solução de problemas */}
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-yellow-800 font-medium mb-2">
                Problemas com leitura?
              </p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>
                  • Use a câmera nativa do celular (não apps de terceiros)
                </li>
                <li>
                  • Baixe o vCard (.vcf) e importe manualmente se necessário
                </li>
                <li>
                  • Tente mudar para "MECARD" no seletor acima para Android
                </li>
                <li>
                  • Certifique-se de que há boa iluminação e foco na câmera
                </li>
                <li>• Mantenha uma distância de 15-30cm do código</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeradorQRCode;
