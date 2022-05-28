const oturum = (req,res,next)=>{
    if (req.isAuthenticated()) {
        res.redirect('/yonetim')
    }
   
}

module.exports = {oturum}