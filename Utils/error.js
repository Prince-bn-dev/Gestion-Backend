 const registerErrors = (err) => {
  let errors = { email: '', motDePasse: '', telephone: ''};

  if (err.message.includes('email')) {
    errors.email = 'Email incorrect';
  }

  if (err.message.includes('telephone')) {
    errors.telephone = 'Numéro de téléphone incorrect';
  }

  if (err.message.includes('motDePasse')) {
    errors.motDePasse = 'Mot de passe incorrect';
  }

  if (err.code === 11000) {
    errors.email = 'Cet email est déjà enregistré';
    return errors;
  }
  if (err.code ===11000) {
    errors.telephone = 'Ce numéro de téléphone est déjà enregistré';
    return errors;
  }

  return errors;
}

const loginErrors = (err) => {
  let errors = { email: '', motDePasse: '' };

  if (err.message.includes('email')) {
    errors.email = 'Email incorrect';
  }
  if (err.message.includes('motDePasse')) {
    errors.motDePasse = 'Mot de passe incorrect';
  }
    if (err.code === 11000) {
        errors.email = 'Cet email est déjà enregistré';
        return errors;
    }
    if (err.message.includes('emailToken')) {
        errors.email = 'Email non vérifié';
    }


  return errors;
}


const vehiculeErrors = (err) => {
  let errors = { registrationNumber: '', model: '', park: '' };

  if (err.message.includes('registrationNumber')) {
    errors.registrationNumber = 'Numéro d\'immatriculation incorrect';
  }

  if (err.message.includes('model')) {
    errors.model = 'Modèle incorrect';
  }

  if (err.message.includes('park')) {
    errors.park = 'Parc incorrect';
  }
  if (err.code === 11000) {
    errors.registrationNumber = 'Numéro d\'immatriculation déjà utilisé';
    return errors;
  }
  if (err.message.includes('model')) {
    errors.model = 'Modèle incorrect';
  }

  return errors;
}

const uploadErrors = (err) => {
  let errors = {
    format: '',
    maxSize: '',
    general: ''
  };

  const message =
    typeof err === 'string' ? err :
    err?.message || '';

  console.log("🔍 uploadErrors - message reçu :", message);

  if (message.includes('invalid file')) {
    errors.format = 'Format incompatible. Seuls les formats JPG, JPEG et PNG sont autorisés.';
  }

  if (message.includes('max size')) {
    errors.maxSize = 'Le fichier dépasse la taille maximale autorisée (500ko).';
  }

  if (message.includes('no file')) {
    errors.format = 'Aucun fichier n’a été envoyé.';
  }

  // Cas de message vide ou erreur inattendue
  if (!errors.format && !errors.maxSize) {
    errors.general = 'Erreur inconnue lors de l’envoi du fichier.';
  }

  return errors;
};

module.exports = { registerErrors, loginErrors  , vehiculeErrors ,uploadErrors};