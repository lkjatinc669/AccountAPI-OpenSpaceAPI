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

function verifyName(name) {
    // (/^[A-Za-z0-9+.]+@[A-Za-z0-9.-]+$/, "gm");
    const nameReg = new RegExp(/^[A-Za-z0-9]/g, )
    return nameReg.test(name);
}

function verifyPassword(pass) {
    // (/^[A-Za-z0-9+.]+@[A-Za-z0-9.-]+$/, "gm");
    const passwordReg = new RegExp(/^[A-Za-z0-9]{40}/g, )
    return passwordReg.test(pass);
}

module.exports = {verifyMail, verifyUserName, verifyName, verifyPassword}