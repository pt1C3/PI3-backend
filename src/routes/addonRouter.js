const express = require('express');
const router = express.Router();
const controller = require('../controllers/addonController');



router.get('/admin/list/:productid/:search?', controller.admin_list_addon)
module.exports = router;