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
  let errors = { format: '', maxSize: '' };

  const message = err?.message || (typeof err === 'string' ? err : '');

  if (message.includes('invalid file')) {
    errors.format = 'Format incompatible. Seuls les formats jpg, jpeg et png sont autorisés.';
  }

  if (message.includes('max size')) {
    errors.maxSize = 'Le fichier dépasse la taille autorisée de 500ko.';
  }

  return errors;
};


module.exports = { registerErrors, loginErrors  , vehiculeErrors ,uploadErrors};