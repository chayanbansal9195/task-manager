const sgMail=require("@sendgrid/mail")


sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendWelcomeMail=(email,name)=>{
    sgMail.send({
        to:email,
        from:"chayanbansal57@gmail.com",
        subject:"Thanks for joining in!",
        text:`Welcome to the app, ${name}. Let me know you get alone with the app`
    })
}

const sendCancelMail=(email,name)=>{
    sgMail.send({
        to:email,
        from:"chayanbansal57@gmail.com",
        subject:"Sorry to see you go",
        text:`Goodbye, ${name}. I hope to see you back sometime`
    })
}

module.exports={
    sendWelcomeMail,
    sendCancelMail
}