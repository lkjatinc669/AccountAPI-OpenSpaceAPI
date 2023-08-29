function verifyMail(mail) {
    // (/^[A-Za-z0-9+.]+@[A-Za-z0-9.-]+$/, "gm");
    const emailReg = new RegExp(/^[A-Za-z0-9+.]{6}[A-Za-z0-9]+@(gmail|yahoo|outlook|hotmail)[.com]/g, )
    return isValidEmail = emailReg.test(mail);
}

function verifyUserName(username) {
    // (/^[A-Za-z0-9+.]+@[A-Za-z0-9.-]+$/, "gm");
    const usernameReg = new RegExp(/^[A-Za-z0-9_.]{5}/g, )
    return usernameReg.test(username);
}

module.exports = {verifyMail, verifyUserName}