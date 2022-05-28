
const  {validationResult} = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const nodeMailer = require('nodemailer');
const jwt = require('jsonwebtoken');

require('../config/passport_local')(passport);

const loginViewForm = (req,res)=>{
    res.render('login',{layout: 'layout/auth_layout'});
}

const registerViewForm = (req,res)=>{
    res.render('register',{layout: 'layout/auth_layout'});
}

const forgetPasswordViewForm = (req,res)=>{
    res.render('forget_password',{layout: 'layout/auth_layout'});
}
const register = async(req,res,next)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('validation_errors',errors.array())
        res.redirect('/register');
        //return res.render('register',{layout: 'layout/auth_layout',errors: errors.array()});
    }else{
        try {
            const _user = await User.findOne({'email': req.body.email})
            if (_user && _user.emailAktif) {
                req.flash('validation_errors',[ {'msg': "Bu Email zaten Kullanımda"}])
                res.redirect('/register');
            }else if((_user && !_user.emailAktif) ||_user== null){
                if(_user && !_user.emailAktif){
                    await User.findByIdAndRemove(_user._id)
                }
                const user = new User({
                    email: req.body.email,
                    name: req.body.name,
                    surname: req.body.surname,
                    password: await bcrypt.hash(req.body.password,10),
                });
               await user.save();
               console.log('Kullancıı Kaydedildi');

               // jwt islemleri 
               const jwtInfo = {
                   _id : user._id
               }
              const token =  jwt.sign(jwtInfo,process.env.JWT_SECRET,{expiresIn: '1d'})
              console.log(token);
              // Mail Gönderme Islemnleri 
              const url = process.env.WEB_URL+'verify?id='+token;

              let transporter = nodeMailer.createTransport({
                  service : 'gmail',
                  auth:{
                      user:process.env.EMAIL_USER,
                      pass:process.env.EMAIL_PASSWORD 
                  }
              })
              await transporter.sendMail({
                  from: "NodeJS Uygulaması <info@gmail.com>",
                  to: user.email,
                  subject: "Email Adresinizi Onaylanız",
                  text: "Email Adresinizi onaylamak için şu linke tıkla" + url
              },(error, info)=>{
                  if (error) {
                      console.log("Mail Gönderme Hatası : " +error)
                  }
                 
                  transporter.close()
              })
              req.flash('success_message',[{'msg':'Lütfen Mail Kutunuzu Kontrol ediniz'}]);
               res.redirect('/login')
            }
           
        } catch (error) {
            next(error)
        }
    }
}
const login = (req,res,next)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('validation_errors',errors.array())
        res.redirect('/login');
        //return res.render('register',{layout: 'layout/auth_layout',errors: errors.array()});
    }
    passport.authenticate('local',{
        successRedirect :'/yonetim',
        failureRedirect :'/login',
        failureFlash: true
    })(req,res,next)    
}
const forgetPassword = async(req,res)=>{
    console.log(req.body.email);
    const user = await User.findOne({'email':req.body.email})
    if (user) {
        // jwt islemleri 
        const jwtInfo = {
            _id : user._id
        }
       const token =  jwt.sign(jwtInfo,process.env.JWT_SECRET,{expiresIn: '1d'})
       // Mail Gönderme Islemnleri 
       const url = process.env.WEB_URL+'new-password?id='+token;

       let transporter = nodeMailer.createTransport({
           service : 'gmail',
           auth:{
               user:process.env.EMAIL_USER,
               pass:process.env.EMAIL_PASSWORD 
           }
       })
       await transporter.sendMail({
           from: "NodeJS Uygulaması Şifre Sıfırlama <info@gmail.com>",
           to: user.email,
           subject: "Şifre Sıfırlama",
           text: "Şifrenizi Sıfırlamak için tıklayınız " + url
       },(error, info)=>{
           if (error) {
               console.log("Mail Gönderme Hatası : " +error)
           }
          
           transporter.close()
       })
       req.flash('success_message',[{'msg':'Lütfen Mail Kutunuzu Kontrol ediniz'}]);
        res.redirect('/login')
    } else {
        console.log("Kullanıcı Bulunamadı");
        req.flash('error',"Kullanıcı Bulunamadı !")
        redirect('/forget-password');
    }
}
const logout = (req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
      });

}
const verifyMail = (req,res,next)=>{
    const token = req.query.id;
    if (token) {
        jwt.verify(token,process.env.JWT_SECRET,async(error,decode)=>{
            try {
                if (error) {
                    req.flash('error','Kod Hatalı veya Süresi Geçmiş Lütfen Tekrar Üye Olun');
                    res.redirect('/login');                  
                }else {
                    const _id = decode._id;
                    const sonuc = await User.findByIdAndUpdate(_id,{emailAktif: true});
                    if(sonuc){
                        req.flash('success_message',[{msg: "Mail Başarıyla Onaylandı."}])
                        res.redirect('/login');
                    }else{
                        req.flash('error','Kod Hatalı veya Süresi Geçmiş Lütfen Tekrar Üye Olun');
                        res.redirect('/login');

                    }
                }
            } catch (error) {
                next(error)
            }
        })
    }else{
        console.log("Token yok");
    }

}
const newPasswordView = (req,res,next)=>{
    const token = req.query.id;
    var _id = 0
    if (token) {
        console.log(token);
        jwt.verify(token,process.env.JWT_SECRET,async(error,decode)=>{
            try {
                if (error) {
                    console.log(error)
                    req.flash('error','Kod Hatalı veya Süresi Geçmiş Lütfen Tekrar Şifremi Unuttum Ekranına Gidip yeni kod alın');
                    res.redirect('/login');                  
                }
                _id = decode._id;
            } catch (error) {
                next(error)
            }
        })
    }else{
        console.log("Token yok");
    }
    res.render('forget_password_entry',{layout: 'layout/auth_layout',_id:_id});
}
const newPassword = async(req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('validation_errors',errors.array())
        res.redirect('/new-password');
    }
    
    const user = await User.findByIdAndUpdate(req.query._id,{password: await bcrypt.hash(req.body.password,10)})

    if (user) {
        console.log(user)
        req.flash('success_message',[{msg: "Şifre Başarıyla Sıfırladı Lütfen Giriş Yapınız."}])
        res.redirect('/login');
    } else {
        req.flash('validation_errors',[{msg: "İşlem Başarısız lütfen tekrar deneyiniz !"}])
        res.redirect('/forget-password'); 
    }
}
module.exports = {newPasswordView,newPassword,verifyMail,logout,loginViewForm,forgetPassword, registerViewForm,register, forgetPasswordViewForm,login}