const express = require('express');
const router = express.Router();
const controller = require('../controllers/versionController');



router.post('/product/create/', controller.add_version_product);
router.get('/status', controller.get_status)
module.exports = router;