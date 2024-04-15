const express=require('express')
const router=express.Router()
const custemerController=require('../controllers/custemerController')
const verifierToken = require('../middleware/authMiddleware');

router.post('/signup',custemerController.createCustemers)
router.post('/login',custemerController.loginCustemers)
router.get('/',verifierToken,custemerController.getAllCustemers)
router.get('/me',verifierToken,custemerController.getProfileCustemers)
router.get('/:id',verifierToken,custemerController.getCustemersById)
router.put('/:id',verifierToken,custemerController.updateCustemers)

module.exports = router;