function verifyMail(mail) {
    // (/^[A-Za-z0-9+.]+@[A-Za-z0-9.-]+$/, "gm");
    const emailReg = new RegExp(/^[A-Za-z0-9+.]{5}[A-Za-z0-9]+@(gmail|yahoo|outlook|hotmail)[.com]/g, )
    return isValidEmail = emailReg.test(mail);
}

module.exports = {verifyMail}