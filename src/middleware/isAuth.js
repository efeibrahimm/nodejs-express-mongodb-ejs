const oturum = (req,res,next)=>{
    if (req.isAuthenticated()) {
        next();
    }else{
        req.flash('error',['Lütfen Önce Oturum Açın !!!'])
        res.redirect('/login')
    }
    
}
const oturumYok = (req,res,next)=>{
    if (!req.isAuthenticated()) {
        next()
    }else{
        res.redirect('/yonetim')
    }
    
}

module.exports = {oturum,oturumYok}