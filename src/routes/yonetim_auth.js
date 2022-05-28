const router = require('express').Router();
const {viewHomePage} = require('../controllers/yonetimController')
const isAuth = require('../middleware/isAuth');
router.get('/',isAuth.oturum,viewHomePage)

module.exports = router