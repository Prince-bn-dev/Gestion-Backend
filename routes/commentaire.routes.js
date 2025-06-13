const express = require('express');
const router = express.Router();
const commentaireController = require('../controllers/commentaire.controller');


router.post('/', commentaireController.createCommentaire);
router.get('/', commentaireController.getCommentaires);
router.get('/:id', commentaireController.getCommentaireById);
router.get('/voyage/:voyageId', commentaireController.getCommentairesByVoyage);
router.put('/:id', commentaireController.updateCommentaire);
router.delete('/:id', commentaireController.deleteCommentaire);

module.exports = router;
