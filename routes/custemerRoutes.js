const express=require('express')
const router=express.Router()
const custemerController=require('../controllers/custemerController')
const verifyToken = require('../middleware/authMiddleware');

router.post('/signup',custemerController.createCustemers)
router.post('/login',custemerController.loginCustemers)
router.get('/',verifyToken,custemerController.getAllCustemers)
router.get('/profile/me',verifyToken,custemerController.getProfileCustemers)
router.get('/:id',verifyToken,custemerController.getCustemersById)
router.put('/:id',verifyToken,custemerController.updateCustemers)

module.exports = router;