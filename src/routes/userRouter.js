const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const controller = require('../controllers/userController');

/*const multer = require('multer'); //Serve para facilitar o upload de ficheiros, age como um middleware, antes das funções dos controllers

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/'); // Pasta onde os ficheiros serão armazenados
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + '-' + file.originalname; //Cria um nome unico para o ficheiro, neste caso "[data] - [nome do ficheiro]"
        cb(null, filename); // Cria o nome para o ficheiro
    }
});

const upload = multer({ storage: storage }); //Cria a função/middleware responsável por fazer o upload dos ficheiros
*/

router.get('/', controller.users_list);
router.post('/login', controller.login);

//router.post('/create', /*upload.single('foto'),*/ controller.produtos_add); //O middleware é chamado antes do controller
/*
router.get('/soum', controller.apenasum);
router.put('/update/:id', upload.single('foto'), controller.filme_update); //O middleware é chamado antes do controller
router.delete('/delete/:id', controller.filme_delete);
router.get('/count/', controller.filmes_count);
router.get('/genero-count', controller.filme_genero_count);
*/
module.exports = router;