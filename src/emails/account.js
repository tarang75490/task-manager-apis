const sgMail = require('@sendgrid/mail')

// const sendgridAPIKey =""
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)



const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to:email,
        from:'tarangkhetan111@gmail.com',
        subject:'Thanks for joining in',
        text:`Welcome to the app. ${name}.  Let me Know how you get along with the app.`

    })
}
const sendCancellationEmail = (email, name) =>{
    sgMail.send({
        to:email,
        from:'tarangkhetan111@gmail.com',
        subject:'Successfull cancellation',
        text:`Successful cancellation of the account h. ${name}.  Let me Know how you get along with the app.Let Me know the reason Behind Cancellation.`

    })
}


module.exports={
    sendWelcomeEmail,
    sendCancellationEmail
}
