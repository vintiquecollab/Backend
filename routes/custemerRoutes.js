const express=require('express')
const router=express.Router()
const custemerController=require('../controllers/custemerController')
const { verifyToken, tryCatch } = require('../middleware/authMiddleware');

router.post('/signup', tryCatch(custemerController.createCustemers));
router.post('/login', tryCatch(custemerController.loginCustemers));
router.get('/', tryCatch(custemerController.getAllCustemers));
router.get('/profile/me', verifyToken, tryCatch(custemerController.getProfileCustemers));
router.get('/:id', verifyToken, tryCatch(custemerController.getCustemersById));
router.put('/:id', tryCatch(custemerController.updateCustemers));
router.post('/admin', tryCatch(custemerController.createCustemerAdmin));


module.exports = router;