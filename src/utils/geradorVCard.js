/**
 * Gera uma string vCard (vcf) a partir dos dados do funcionário
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
  
  if (nomeCompleto) {
    vcard += `FN:${nomeCompleto}\n`;
    vcard += `N:${nomeCompleto};;;\n`;
  }
  
  if (empresa) {
    vcard += `ORG:${empresa}\n`;
  }
  
  if (cargo) {
    vcard += `TITLE:${cargo}\n`;
  }
  
  if (email) {
    vcard += `EMAIL;TYPE=WORK,INTERNET:${email}\n`;
  }
  
  if (telefone) {
    const telefoneLimpo = telefone.replace(/\D/g, '');
    vcard += `TEL;TYPE=CELL,VOICE:${telefoneLimpo}\n`;
  }
  
  if (whatsapp) {
    const whatsappLimpo = whatsapp.replace(/\D/g, '');
    vcard += `URL;TYPE=WHATSAPP:https://wa.me/${whatsappLimpo}\n`;
  }
  
  if (website) {
    vcard += `URL;TYPE=WORK:${website}\n`;
  }
  
  if (linkedin) {
    vcard += `URL;TYPE=LinkedIn:${linkedin}\n`;
  }
  
  if (cidade || localizacao) {
    vcard += `ADR;TYPE=WORK:;;${localizacao || ''};${cidade || ''};;;\n`;
  }
  
  if (fotoPerfil && fotoPerfil.startsWith('http')) {
    vcard += `PHOTO;TYPE=URL:${fotoPerfil}\n`;
  }
  
  let nota = '';
  if (cidade) nota += `Cidade: ${cidade}\n`;
  if (localizacao) nota += `Localização: ${localizacao}\n`;
  if (nota) {
    vcard += `NOTE:${nota.trim()}\n`;
  }
  
  vcard += 'END:VCARD';
  
  return vcard;
}

/**
 * Gera uma URL de dados vCard que pode ser usada no QR Code
 */
export function gerarURLVCard(dados) {
  const vcard = gerarVCard(dados);
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`;
}

