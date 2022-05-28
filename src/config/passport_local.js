const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');
module.exports = function(passport){
    const options = {
        usernameField : 'email',
        passwordField :'password'
    }
    passport.use(new LocalStrategy(options,async (email,password,done)=>{
        try {
          const user =  await User.findOne({'email':email});
          if (!user) {
            return done(null,false,{message: 'User Bulunamadı'})
          } 

          if (!bcrypt.compare(password, user.password)) {
            return done(null,false,{message: 'Şifre Hatalı'})
          }
          return done(null,user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser(function(user,done){
        console.log('Sessiona Kaydedildi :' +user._id)
        done(null,user._id);
    })
    passport.deserializeUser(function(_id,done){
        console.log('Sessiona Kaydedilen _id arandı ve bulundu')

        User.findById(_id,(err,user)=>{
            const newUser = {
                email : user.email,
                _id: user._id,
                name: user.name,
                surname :user.surname
            }
            done(err,newUser)
        })
    })
}
