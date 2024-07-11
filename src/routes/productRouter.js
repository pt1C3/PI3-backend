const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

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

router.get('/', controller.products_min_list);
router.get('/search/:search', controller.search_products_list);
router.get('/admin/list/:search?', controller.admin_list_products);
router.get('/admin/versions/:productid', controller.admin_versions_product)
router.post('/add', controller.product_add); 
router.post('/edit', controller.product_edit); 
router.get('/status', controller.get_status);
router.get('/categories', controller.get_categories);
router.delete('/delete/:productid', controller.product_delete)
router.get('/:id', controller.single_product);

/*
router.get('/soum', controller.apenasum);
router.put('/update/:id', upload.single('foto'), controller.filme_update); //O middleware é chamado antes do controller
router.delete('/delete/:id', controller.filme_delete);
router.get('/count/', controller.filmes_count);
router.get('/genero-count', controller.filme_genero_count);
*/
module.exports = router;