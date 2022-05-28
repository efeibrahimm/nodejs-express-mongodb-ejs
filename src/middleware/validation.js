const { body } = require('express-validator');

const validateNewUser = () => {
    return [
        body('email')
            .trim()
            .isEmail().withMessage('Geçerli Bir Mail Giriniz'),
        body('password')
            .trim()
            .isLength({ min: 6 }).withMessage('Şifre en az 6 Karekter Olmalıdır')
            .isLength({ max: 20 }).withMessage('Şifre max 20 Karekter Olmalıdır'),
        body('name')
            .trim()
            .isLength({ min: 2 }).withMessage('Name en az 2 Karekter Olmalıdır')
            .isLength({ max: 50 }).withMessage('Name max 50 Karekter Olmalıdır'),
        body('surname')
            .trim()
            .isLength({ min: 2 }).withMessage('Surname en az 2 Karekter Olmalıdır')
            .isLength({ max: 50 }).withMessage('Surname max 50 Karekter Olmalıdır'),
        body('repassword').trim().custom((value, {req})=>{
            if (value !== req.body.password) {
                throw new Error('Şifreler Aynı Değil');
            } return true;
        })
         
    ];
}
const validateLogin = () => {
    return [
        body('email')
            .trim()
            .isEmail().withMessage('Geçerli Bir Mail Giriniz'),
        body('password')
            .trim()
            .isLength({ min: 6 }).withMessage('Şifre en az 6 Karekter Olmalıdır')
            .isLength({ max: 20 }).withMessage('Şifre max 20 Karekter Olmalıdır'),
         
    ];
}
const validateForgetPassword = () => {
    return [
        body('password')
        .trim()
        .isLength({ min: 6 }).withMessage('Şifre en az 6 Karekter Olmalıdır')
        .isLength({ max: 20 }).withMessage('Şifre max 20 Karekter Olmalıdır'),
    body('repassword').trim().custom((value, {req})=>{
        if (value !== req.body.password) {
            throw new Error('Şifreler Aynı Değil');
        } return true;
    })
    ];
}
module.exports = {
    validateNewUser,
    validateLogin,
    validateForgetPassword
}