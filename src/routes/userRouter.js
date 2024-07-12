const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const controller = require('../controllers/userController');

/*
const multer = require('multer'); //Serve para facilitar o upload de ficheiros, age como um middleware, antes das funções dos controllers

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/images/users'); // Pasta onde os ficheiros serão armazenados
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + '-' + file.originalname; //Cria um nome unico para o ficheiro, neste caso "[data] - [nome do ficheiro]"
        cb(null, filename); // Cria o nome para o ficheiro
    }
});

const upload = multer({ storage: storage }); //Cria a função/middleware responsável por fazer o upload dos ficheiros
*/

router.get('/', controller.users_list);
router.get('/free', controller.free_users_list);

router.post('/login', controller.login);
router.post('/create', controller.create_user)
router.get('/plans/:businessid', controller.user_plans);
router.get('/addon/plans/:businessid', controller.user_addon_plans);

router.get('/payments', controller.payments);
router.get('/history/:businessid', controller.payment_history);


router.get('/inserts', controller.inserts)
router.get('/updates', controller.inserts)

router.get('/encrypt', controller.encrypt_passwords);
module.exports = router;