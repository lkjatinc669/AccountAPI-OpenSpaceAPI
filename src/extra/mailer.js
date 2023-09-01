require("dotenv").config()
nodemailer = require('nodemailer');

const smtpProtocol = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false,
    auth: {
        user: "t.frozen.143@gmail.com",
        pass: "EtOa8c9pdHFBqbD7"
    }
});

console.log("smtpProtocol "+smtpProtocol);

async function sendMailOTP(to, otp){
    const mailoption = {
        from: "info.openspaceapi@api",
        to: to,
        subject: "Your OTP",
        text:"Your OTP is "+otp,
        html: OTPhtml(otp)
    }

    console.log("MailOption "+mailoption)

    const info = await smtpProtocol.sendMail(mailoption, function(err, response){
        if(err) {
            console.log(err);
        }
        console.log('Message Sent' + response.message);
        smtpProtocol.close();
    });
    console.log("Info "+info)
}

OTPhtml = (data) => `<!DOCTYPE html><html lang="en"><head><style>*{margin:0;padding:0;box-sizing:border-box}html{height:300px}body{height:100%;background-color:#171717;color:#f5f5f5;display:flex;flex-direction:column;align-items:center;justify-content:center}img{width:130px;border-radius:10px}</style></head><body><img src="https://deep-image.ai/blog/content/images/2022/09/underwater-magic-world-8tyxt9yz.jpeg" alt="logo"><h1 id="title">EBooksy</h1><h4>Integration with OpenSpaceAPI</h4><p>Your OTP is ${data}</p></body></html>`

module.exports = {sendMailOTP}


// const transporter = nodemailer.createTransport({

//     host: "smtp-relay.sendinblue.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: "t.frozen.143@gmail.com",
//         pass: "EtOa8c9pdHFBqbD7"
//     }
//   });




// transporter.verify(function (error, success) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Server is ready to take our messages");
//     }
//   });