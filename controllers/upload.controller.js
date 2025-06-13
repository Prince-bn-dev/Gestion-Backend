const fs = require('fs');
const path = require('path');
const { uploadErrors } = require('../Utils/error');
const User = require('../models/User');

module.exports.uploadProfil = async (req, res) => {
  try {
    if (
      req.file.mimetype !== 'image/jpg' &&
      req.file.mimetype !== 'image/jpeg' &&
      req.file.mimetype !== 'image/png'
    ) {
      throw Error('invalid file');
    }

    if (req.file.size > 500000) {
      throw Error('max size');
    }

    const fileName = req.body.nom + '.jpg';
    const uploadPath = path.join(__dirname, '../client/uploads/profil');

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    fs.writeFileSync(path.join(uploadPath, fileName), req.file.buffer);
     
    const user = await User.findByIdAndUpdate(
        req.body.userId,
        {$set:{image:"uploads/profil/"+fileName}},
        {new:true , upsert:true, setDefaultsOnInsert:true}, 
    )
    return res.status(200).send({ message: 'Image enregistrée avec succès'+user });
  } catch (error) {
    console.log("Erreur lors de l'enregistrement de l'image : ", error);
    const err = uploadErrors(error);
    return res.status(400).send({ error: err });
  };
};



