const express = require('express');
const router = express.Router();
const controller = require('../controllers/businessController');



router.post('/create', controller.add_business);
/*
router.put('/update/:id', upload.single('foto'), controller.filme_update); //O middleware é chamado antes do controller
router.delete('/delete/:id', controller.filme_delete);
router.get('/count/', controller.filmes_count);
router.get('/genero-count', controller.filme_genero_count);
router.get('/:id', controller.filme_detail);
*/
module.exports = router;