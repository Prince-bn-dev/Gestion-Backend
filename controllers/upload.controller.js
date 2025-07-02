const { uploadErrors } = require('../Utils/error');
const User = require('../models/User');

module.exports.uploadProfil = async (req, res) => {
  try {
    if (!req.file) throw new Error("no file");

    const imageUrl = req.file.path; 

    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { $set: { image: imageUrl } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).send({
      message: 'Image envoyée avec succès sur Cloudinary.',
      user
    });

  } catch (error) {
    console.log("Erreur uploadProfil (Cloudinary):", error.message);
    const err = uploadErrors(error);
    return res.status(400).send({ error: err });
  }
};
