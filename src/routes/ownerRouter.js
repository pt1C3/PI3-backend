const express = require('express');
const router = express.Router();
const controller = require('../controllers/ownerController');


router.get('/licenses/:businessid', controller.licenses_list);
router.post('/addplanpayment', controller.payment_plan_add);
router.delete('/cancelplan/:planid', controller.cancel_plan);
router.delete('/removemanager/:userid', controller.remove_manager);
router.post('/addmanagers', controller.add_managers);

router.post('/managelicenses', controller.manage_licenses)

router.get('/products/:businessid', controller.get_products);
router.get('/:businessid/:search?', controller.users_list);

module.exports = router;