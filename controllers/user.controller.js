const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendMail } = require("../Utils/mail");
const { registerErrors, loginErrors } = require('../Utils/error');
const { sendSms, generateSmsCode } = require("../Utils/sms");


const JWT_SECRET = process.env.JWT_SECRET;


exports.register = async (req, res) => {
  const { nom, prenom, email, telephone, motDePasse, role } = req.body;

  try {
    if (!email && !telephone) {
      return res.status(400).json({ message: "Email ou téléphone requis." });
    }

      const query = [];
      if (email) query.push({ email });
      if (telephone) query.push({ telephone });

      if (query.length === 0) {
        return res.status(400).json({ message: "Email ou téléphone requis." });
      }

      const existingUser = await User.findOne({ $or: query });

      if (existingUser) {
        if (email && existingUser.email === email) {
          return res.status(400).json({ message: "Email déjà utilisé." });
        }
        if (telephone && existingUser.telephone === telephone) {
          return res.status(400).json({ message: "Téléphone déjà utilisé." });
        }
      }
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const userData = {
      nom,
      prenom,
      email,
      telephone,
      motDePasse: hashedPassword,
      role
    };

    if (email) {
      const emailToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
      userData.emailToken = emailToken;
      userData.emailVerified = false;
      await sendMail(
        email,
       "Vérification de votre adresse email",
      `
        Bonjour,
    
        Merci d'avoir créé un compte sur notre plateforme ! Afin de finaliser votre inscription et d'activer votre compte, veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous :
    
        <br /><br />
        <a href="http://localhost:5173/verifyEmail/${emailToken}" style="color: #007bff; text-decoration: none; font-weight: bold;">Vérifier mon adresse email</a>
        <br /><br />
    
        Si vous n'avez pas créé de compte, veuillez ignorer cet email. 
    
        Cordialement,<br />
        L'équipe de support
      `
      );
    }

    if (!email && telephone) {
      const smsCode = generateSmsCode();
      userData.smsCode = smsCode; 
      userData.smsCodeExpires = new Date(Date.now() + 10 * 600 * 10000); 

      await sendSms(telephone, `Votre code de vérification est : ${smsCode}`);
    }

    const user = await User.create(userData);

    return res.status(201).json({
      message: email
        ? "Compte créé. Vérifiez votre email."
        : "Compte créé. Un code SMS a été envoyé.",
      user
    });

  } catch (err) {
    console.log("Erreur lors de l'inscription :", err);
    const errors = registerErrors(err);
    return res.status(500).json({ errors });
  }
};

exports.login = async (req, res) => {
  const { identifiant, motDePasse } = req.body;

  try {
    console.log("Tentative de connexion avec :", identifiant);

    const user = await User.findOne({
      $or: [
        { email: identifiant },
        { telephone: identifiant }
      ]
    });

    if (!user) return res.status(401).json({ message: "Identifiants incorrects." });

    const emailOk = user.email ? user.emailVerified : false;
    const phoneOk = user.telephone ? user.telephoneVerified : false;

    if (!emailOk && !phoneOk) {
      return res.status(403).json({ message: "Veuillez vérifier votre adresse email ou votre numéro de téléphone." });
    }

    const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isPasswordValid) return res.status(401).json({ message: "Mot de passe incorrect." });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET, // ✅ corrigé ici
      { expiresIn: "24h" }
    );

    return res.status(200).json({ message: "Connexion réussie", token });

  } catch (err) {
    console.error("Erreur login :", err); // ✅ log complet
    return res.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-motDePasse -emailToken');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verify = async (req, res) => {
  const { emailToken } = req.params;
  console.log("Token reçu :", emailToken);
  console.log("JWT_SECRET:", JWT_SECRET);

  try {
    const decoded = jwt.verify(emailToken, JWT_SECRET);
    console.log("Token décodé :", decoded);

    const userEmail = decoded.email;
    const user = await User.findOne({ email: userEmail, emailToken });

    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expiré." });
    }

    user.emailVerified = true;
    user.emailToken = null;
    await user.save();

    return res.status(200).json({ message: "Email vérifié avec succès !" });

  } catch (error) {
    console.error("Erreur verify:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: "Lien expiré. Renvoyez un nouveau lien de vérification." });
    }
    return res.status(400).json({ message: "Token invalide." });
  }
};

exports.verifyPhoneCode = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({smsCode:code });

    if (!user || user.smsCode !== code) {
      return res.status(400).json({ message: "Code incorrect." });
    }

    if (user.smsCodeExpires < Date.now()) {
      return res.status(400).json({ message: "Code expiré." });
    }

    user.telephoneVerified = true;
    user.smsCode = null;
    user.smsCodeExpires = null;
    await user.save();

    res.status(200).json({ message: "Téléphone vérifié avec succès." });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resendSmsCode = async (req, res) => {
  const { telephone } = req.body;
  try {
    const user = await User.findOne({ telephone });
    if (!user) {  
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    if (user.telephoneVerified) {
      return res.status(400).json({ message: "Le numéro de téléphone est déjà vérifié." }); 
    }
    const smsCode = generateSmsCode();
    user.smsCode = smsCode;
    user.smsCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendSms(telephone, `Votre nouveau code de vérification est : ${smsCode}`);
    res.status(200).json({ message: "Nouveau code SMS envoyé." });
  } catch (error) {
    console.error("Erreur lors de la renvoi du code SMS :", error);
    res.status(500).json({ message: "Erreur lors de l'envoi du code SMS." });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('nom email role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    const isMatch = await bcrypt.compare(oldPassword, user.motDePasse);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe actuel incorrect." });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.motDePasse = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.forgotPassword = async (req, res) => {
  const { identifiant } = req.body; 

  try {
    const user = await User.findOne({
      $or: [{ email: identifiant }, { telephone: identifiant }]
    });

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    if (user.email === identifiant) {
      const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      user.resetToken = resetToken;
      await user.save();

      await sendMail(
        user.email,
        "Réinitialisation de votre mot de passe",
        `
          Bonjour ${user.nom},

          Vous avez demandé la réinitialisation de votre mot de passe. Veuillez cliquer sur le lien ci-dessous pour le faire :
          <br /><br />
          <a href="http://localhost:5173/resetPassword/${resetToken}" style="color: #007bff; text-decoration: none; font-weight: bold;">Réinitialiser mon mot de passe</a>
          <br /><br />
          Si vous n'avez pas fait cette demande, ignorez cet email.
          <br /><br />
          Cordialement,<br />
          L'équipe de support
        `
      );

      return res.status(200).json({ message: "Email de réinitialisation envoyé." });
    }

    if (user.telephone === identifiant) {
      const smsCode = generateSmsCode();
      user.smsResetCode = smsCode;
      user.smsResetCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      await sendSms(user.telephone, `Code de réinitialisation : ${smsCode}`);

      return res.status(200).json({ message: "Code de réinitialisation envoyé par SMS." });
    }

  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe :", error);
    res.status(500).json({ message: "Erreur lors de la réinitialisation du mot de passe." });
  }
};

exports.resetPasswordWithSms = async (req, res) => {
  const { telephone, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ telephone });

    if (!user || user.smsResetCode !== code) {
      return res.status(400).json({ message: "Code invalide." });
    }

    if (user.smsResetCodeExpires < Date.now()) {
      return res.status(400).json({ message: "Code expiré." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.motDePasse = hashedPassword;
    user.smsResetCode = null;
    user.smsResetCodeExpires = null;
    await user.save();

    return res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });

  } catch (error) {
    console.error("Erreur resetPasswordWithSms :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(resetToken, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.resetToken || user.resetToken !== resetToken) {
      return res.status(400).json({ message: "Token invalide ou expiré." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.motDePasse = hashedPassword;
    user.resetToken = null; 
    await user.save();

    return res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });

  } catch (error) {
    console.error("Erreur resetPassword :", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: "Lien expiré. Veuillez demander un nouveau lien de réinitialisation." });
    }
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getChauffeurs = async (req, res) => {
  try {
    const chauffeurs = await User.find({ role: 'chauffeur' }).select('_id name email');
    res.status(200).json(chauffeurs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};













