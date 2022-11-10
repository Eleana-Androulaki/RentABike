module.exports = (req,res,next)=>{
    const role = req?.user?.role;

    if(role)
    {
        if(role === "Manager")
        {
            next();
        }
        else
        {
            res.status(401).send("Only managers are allowed to perform this action");
        }
    }
    else
    {
        res.status(401).send("Only managers are allowed to perform this action");
    }
}