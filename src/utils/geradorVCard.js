// src/utils/geradorVCard.js

/**
 * Formata número de telefone removendo caracteres não numéricos
 */
export const formatarTelefone = (telefone) => {
  if (!telefone) return '';
  // Remove todos os caracteres não numéricos, mantendo o sinal de + se presente
  return telefone.replace(/[^\d+]/g, '');
};

/**
 * Gera uma string vCard (vcf) a partir dos dados do funcionário
 * Formato vCard 3.0 corrigido para compatibilidade máxima
 */
export function gerarVCard(dados) {
  const {
    nomeCompleto,
    email,
    telefone,
    empresa,
    cargo,
    cidade,
    localizacao,
    website,
    linkedin,
    whatsapp,
    fotoPerfil
  } = dados;

  let vcard = 'BEGIN:VCARD\n';
  vcard += 'VERSION:3.0\n';
  
  // Nome é o campo mais importante - deve vir primeiro e corretamente formatado
  if (nomeCompleto) {
    // Divide o nome em partes para formato correto
    const nomes = nomeCompleto.trim().split(' ');
    const sobrenome = nomes.pop() || '';
    const primeiroNome = nomes.join(' ') || nomeCompleto;
    
    vcard += `N:${sobrenome};${primeiroNome};;;\n`;
    vcard += `FN:${nomeCompleto}\n`;
  }
  
  if (empresa) {
    vcard += `ORG:${empresa}\n`;
  }
  
  if (cargo) {
    vcard += `TITLE:${cargo}\n`;
  }
  
  if (email) {
    vcard += `EMAIL;TYPE=INTERNET;TYPE=WORK;TYPE=pref:${email}\n`;
  }
  
  if (telefone) {
    const telefoneLimpo = formatarTelefone(telefone);
    if (telefoneLimpo) {
      vcard += `TEL;TYPE=WORK;TYPE=VOICE;TYPE=pref:${telefoneLimpo}\n`;
    }
  }
  
  if (whatsapp) {
    const whatsappLimpo = formatarTelefone(whatsapp);
    if (whatsappLimpo) {
      // Para WhatsApp, usamos um formato especial que alguns apps reconhecem
      vcard += `TEL;TYPE=CELL;TYPE=WHATSAPP:${whatsappLimpo}\n`;
      // Também adicionamos como URL do WhatsApp
      vcard += `URL;TYPE=WhatsApp:https://wa.me/${whatsappLimpo}\n`;
    }
  }
  
  if (website) {
    vcard += `URL;TYPE=WORK:${website}\n`;
  }
  
  if (linkedin) {
    vcard += `URL;TYPE=LinkedIn:${linkedin}\n`;
  }
  
  if (cidade || localizacao) {
    // Formato correto para endereço: ;;;endereço;cidade;;;código postal;país
    vcard += `ADR;TYPE=WORK;TYPE=pref:;;${localizacao || ''};${cidade || ''};;;;\n`;
  }
  
  if (fotoPerfil && fotoPerfil.startsWith('http')) {
    vcard += `PHOTO;VALUE=URI;TYPE=JPEG:${fotoPerfil}\n`;
  }
  
  // Adiciona uma nota com informações adicionais
  let nota = '';
  if (cargo) nota += `Cargo: ${cargo}\n`;
  if (empresa) nota += `Empresa: ${empresa}\n`;
  if (cidade) nota += `Cidade: ${cidade}\n`;
  if (localizacao) nota += `Endereço: ${localizacao}\n`;
  
  if (nota) {
    vcard += `NOTE:${nota.trim()}\n`;
  }
  
  // Data de revisão - importante para contatos
  vcard += `REV:${new Date().toISOString()}\n`;
  
  vcard += 'END:VCARD';
  
  return vcard;
}

/**
 * Gera uma URL de dados vCard que pode ser usada no QR Code
 */
export function gerarURLVCard(dados) {
  const vcard = gerarVCard(dados);
  // Codifica o vCard para URL, garantindo que caracteres especiais sejam tratados
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`;
}

/**
 * Gera MECARD formatado (alternativa mais simples para alguns dispositivos)
 */
export function gerarMeCard(dados) {
  const {
    nomeCompleto,
    email,
    telefone,
    empresa,
    cargo,
    cidade,
    localizacao,
    website
  } = dados;

  let mecard = 'MECARD:';
  
  if (nomeCompleto) {
    mecard += `N:${nomeCompleto};`;
  }
  
  if (telefone) {
    const telefoneLimpo = formatarTelefone(telefone);
    if (telefoneLimpo) {
      mecard += `TEL:${telefoneLimpo};`;
    }
  }
  
  if (email) {
    mecard += `EMAIL:${email};`;
  }
  
  if (empresa) {
    mecard += `ORG:${empresa};`;
  }
  
  if (cargo) {
    mecard += `TITLE:${cargo};`;
  }
  
  if (website) {
    mecard += `URL:${website};`;
  }
  
  if (cidade || localizacao) {
    const endereco = [localizacao, cidade].filter(Boolean).join(', ');
    mecard += `ADR:${endereco};`;
  }
  
  // Fecha o MECARD com dois pontos e vírgula
  mecard += ';;';
  
  return mecard;
}

/**
 * Gera vCard como URI para download direto
 */
export function gerarVCardURI(dados) {
  const vcard = gerarVCard(dados);
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`;
}

/**
 * Cria e baixa um arquivo vCard (.vcf) automaticamente
 */
export function downloadVCard(dados) {
  const vcard = gerarVCard(dados);
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${dados.nomeCompleto.replace(/\s+/g, '-')}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Limpa a URL após o download
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Gera vCard formatado para contatos simples (apenas nome e telefone)
 * Útil para dispositivos com limitações
 */
export function gerarVCardSimples(dados) {
  const { nomeCompleto, telefone, email } = dados;
  
  let vcard = 'BEGIN:VCARD\n';
  vcard += 'VERSION:2.1\n'; // Versão mais simples para compatibilidade
  
  if (nomeCompleto) {
    vcard += `FN:${nomeCompleto}\n`;
    vcard += `N:${nomeCompleto}\n`;
  }
  
  if (telefone) {
    const telefoneLimpo = formatarTelefone(telefone);
    if (telefoneLimpo) {
      vcard += `TEL;CELL:${telefoneLimpo}\n`;
    }
  }
  
  if (email) {
    vcard += `EMAIL:${email}\n`;
  }
  
  vcard += 'END:VCARD';
  
  return vcard;
}

/**
 * Verifica se o dispositivo suporta vCard via QR Code
 */
export function detectarSuporteVCard() {
  if (typeof window === 'undefined') {
    return { isIOS: false, isAndroid: false, recomendado: 'vCard' };
  }
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Detecta se é iPhone/iPad
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  
  // Detecta se é Android
  const isAndroid = /android/.test(userAgent);
  
  // Detecta navegador
  const isChrome = /chrome/.test(userAgent);
  const isSafari = /safari/.test(userAgent) && !isChrome;
  
  return {
    isIOS,
    isAndroid,
    isChrome,
    isSafari,
    recomendado: isIOS ? 'vCard' : 'MECARD'
  };
}