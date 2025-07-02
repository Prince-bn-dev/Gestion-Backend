const fs = require('fs');
const path = require('path');
const { uploadErrors } = require('../Utils/error');
const User = require('../models/User');

module.exports.uploadProfil = async (req, res) => {
  try {
    if (!req.file) throw new Error("no file");

    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      throw new Error("invalid file");
    }

    if (req.file.size > 500000) {
      throw new Error("max size");
    }


    const fileName = req.body.nom + '.jpg';

    const uploadPath = path.join(__dirname, '../client/uploads/profil');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }


    fs.writeFileSync(path.join(uploadPath, fileName), req.file.buffer);

    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { $set: { image: "uploads/profil/" + fileName } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).send({
      message: 'Image enregistrée avec succès.',
      user
    });

  } catch (error) {
    console.log("❌ Erreur brute :", error);
    console.log("🧵 Erreur message :", error.message);
    const err = uploadErrors(error);
    return res.status(400).send({ error: err });
  }
};
