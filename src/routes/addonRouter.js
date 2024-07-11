const express = require('express');
const router = express.Router();
const controller = require('../controllers/addonController');


router.get('/admin/list/:productid/:search?', controller.admin_list_addon);
router.get('/admin/versions/:addonid', controller.admin_versions_addon);
router.post('/admin/add', controller.add_addon);
router.post('/admin/edit', controller.edit_addon);
router.get('/:addonid', controller.single_addon);

module.exports = router;