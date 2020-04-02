const jwt=require("jsonwebtoken")
const myfu=async()=>{
   const token=(jwt.sign({_id:"abc123"},"thisiswho",{expiresIn:"1 minute"}))
    console.log(token)
    const verify=jwt.verify(token,"thisiswho")
    console.log(verify)
}
myfu()