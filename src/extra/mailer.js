require("dotenv").config()
nodemailer = require('nodemailer');

async function sendFPMailOTP(to, otp){
    const smtpProtocol = nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        secure: false,
        auth: {
            user: "t.frozen.143@gmail.com",
            pass: "EtOa8c9pdHFBqbD7"
        }
    });
    const mailoption = {
        from: "info.openspaceapi@api",
        to: to,
        subject: "Your OTP for Reseting Password",
        text:"Your OTP is "+otp,
        html: VOTPhtml(otp)
    }
    isSend = false
    await smtpProtocol.sendMail(mailoption)
        .then((data)=>{
            console.log(data)
            if (data['accepted'].length > 0){
                isSend = true
            } else {
                isSend = false;
            }
        })
        .catch(err => {
            isSend = false;
        })
    return isSend;
}

FPOTPhtml = (user, OTP) => `<!DOCTYPE html><html><head><meta http-equiv="cache-control" content="no-cache"><meta http-equiv="Pragma" content="no-cache"><meta http-equiv="Expires" content="-1"><style type="text/css">*{margin:0;padding:0;box-sizing:border-box}body{background-color:#0e0a14;color:#fff}a{color:#fff}.container{width:100%;padding:12px;margin:0 auto}.body,.footer,.header{padding:12px}.text-center{text-align:center}.footer{padding-top:20px}</style><title>HTML, CSS and JavaScript demo</title></head><body><div class="container"><div class="header"><h1>EBookSy</h1></div><div class="body"><hr><br><p>Hi ${user},</p><br><p>We received a request to reset your Facebook password.</p><p>Enter the following password reset code:</p><br><p>${OTP}</p><br><hr></div><div class="footer text-center"><p>Powered By</p><h4>OpenSpaceAPI</h4></div></div></body></html>`

async function sendVMailOTP(to, otp){
    const smtpProtocol = nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        secure: false,
        auth: {
            user: "t.frozen.143@gmail.com",
            pass: "EtOa8c9pdHFBqbD7"
        }
    });

    const mailoption = {
        from: "no-reply.openspaceapi@api",
        to: to,
        subject: "Your OTP for eBookSy Account Verification",
        text:"Your OTP is "+otp,
        html: VOTPhtml("User", otp)
    }
    isSend = false
    await smtpProtocol.sendMail(mailoption)
        .then((data)=>{
            console.log(data)
            if (data['accepted'].length > 0){
                isSend = true
            } else {
                isSend = false;
            }
        })
        .catch(err => {
            isSend = false;
        })
    return isSend;
}

VOTPhtml = (user, OTP) => `
<!DOCTYPE html><html><head><meta http-equiv="cache-control" content="no-cache"><meta http-equiv="Pragma" content="no-cache"><meta http-equiv="Expires" content="-1"><style type="text/css">*{margin:0;padding:0;box-sizing:border-box}body{background-color:#0e0a14;color:#fff}a{color:#fff}.container{width:100%;padding:12px;margin:0 auto}.body,.footer,.header{padding:12px}.text-center{text-align:center}.footer{padding-top:20px}</style><title>HTML, CSS and JavaScript demo</title></head><body><div class="container"><div class="header"><h1>EBookSy</h1></div><div class="body"><hr><br><p>Hi ${user},</p><br><p>Your OTP for verification is :</p><br><p>${OTP}</p><br><hr></div><div class="footer text-center"><p>Powered By</p><h4>OpenSpaceAPI</h4></div></div></body></html>`

module.exports = {sendFPMailOTP, sendVMailOTP}