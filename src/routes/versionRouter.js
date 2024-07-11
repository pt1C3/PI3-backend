const express = require('express');
const router = express.Router();
const controller = require('../controllers/versionController');


router.get('/single/:versionid', controller.single_version)
router.post('/product/create/', controller.add_version_product);
router.post('/product/edit/', controller.edit_version_product);
router.post('/addon/create/', controller.add_version_addon);
router.post('/addon/edit/', controller.edit_version_addon);
router.get('/status', controller.get_status)
module.exports = router;