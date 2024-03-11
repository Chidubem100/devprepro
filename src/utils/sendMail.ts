import nodemailerConfig from "./nodemailerConfig";
import nodemailer from  "nodemailer";



function sendMailConfig(to:string, subject:string, html:string){

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
      
    });

    transporter.verify(function (err, success){
        if(err){
            console.log(err)
        }else{
            console.log('connected')
        }
    })

    return transporter.sendMail({
        from:   'Devprepro',
        to,
        subject,
        html,
    })
}



export default sendMailConfig;