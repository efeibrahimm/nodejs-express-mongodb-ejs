const User = require('../models/user.js');
const viewHomePage= async(req,res,next)=>{
    res.render('index',{layout: 'layout/auth_layout'});   
}

module.exports ={viewHomePage}