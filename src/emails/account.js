const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SG_API_KEY)

const sendWelcomeEmail = (user) =>{
    sgMail.send({
        to : user.email , 
        from : 'p.dadsetan7370@gmail.com' ,
        subject : `Thanks for using Task App dear ${user.name}` ,
        text : 'Manage your tasks easily , not worrying to forget them.'
    })
}

const sendCancelationEmail = (user) =>{
    sgMail.send({
        to : user.email ,
        from : 'p.dadsetan7370@gmail.com' ,
        subject : 'Let us know why you\'re leaving!' ,
        text : 'Let us know about the app\'s problems so that we can improve the app'
    })
}


module.exports = {sendWelcomeEmail , sendCancelationEmail}