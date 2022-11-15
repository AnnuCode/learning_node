//curry function which can act as a middleware

const verifyRoles = (...allowedRoles) =>{
   
    return (req,res,next)=>{
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles]
        const roles = req.roles
        console.log(rolesArray)
        console.log(req.roles)
        // const result = roles.map(role=> rolesArray.includes(role).find(val => val === true) ) //stupid error
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if(!result) res.sendStatus(401)
        next()
    }
}
module.exports = verifyRoles