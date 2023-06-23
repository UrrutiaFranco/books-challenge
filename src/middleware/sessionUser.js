module.exports = (req , res , next) =>{
    let {cookies} = req

    if ('login' in cookies) {
        res.locals.isLogged = true
        res.locals.name = cookies.name
        console.log(cookies.name)
    }

    res.locals.admin = cookies.admin

    next();
}