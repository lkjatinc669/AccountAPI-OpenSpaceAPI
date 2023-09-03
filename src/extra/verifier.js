function verifyMail(mail) {
    var mailReg = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (mail !== '' && mail.match(mailReg)) { return true; }
    return false;
}

function verifyUserName(username) {
    const usernameReg = /[A-Za-z0-9_.]{5}/g
    if (username !== '' && username.match(usernameReg) && username.length<26) { return true; }
    return false;
}

function verifyName(name) {
    const nameReg = /[A-Za-z0-9]/g
    if (name !== '' && name.match(nameReg) && name.length <16) { return true; }
    return false;
}

function verifyPassword(pass) {
    const passwordReg = /[A-Za-z0-9]{40}/g
    if (pass !== '' && pass.match(passwordReg)) { return true; }
    return false;
}

module.exports = {verifyMail, verifyUserName, verifyName, verifyPassword}