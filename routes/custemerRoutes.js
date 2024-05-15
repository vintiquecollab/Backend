const express=require('express')
const router=express.Router()
const custemerController=require('../controllers/custemerController')
const { verifyToken, tryCatch } = require('../middleware/authMiddleware');
const  photoUpload = require('../middleware/photoUpload')

router.post('/signup',photoUpload.single("image"), tryCatch(custemerController.createCustemers));
router.post('/login', tryCatch(custemerController.loginCustemers));
router.get('/',photoUpload.single("image"),  tryCatch(custemerController.getAllCustemers));
router.get('/profile/me',photoUpload.single("image"),  verifyToken, tryCatch(custemerController.getProfileCustemers));
router.get('/:id',photoUpload.single("image"), tryCatch(custemerController.getCustemersById));
router.put('/:id',photoUpload.single("image"), tryCatch(custemerController.updateCustemers));
router.post('/admin',photoUpload.single("image"), tryCatch(custemerController.createCustemerAdmin));


module.exports = router;