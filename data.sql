CREATE TABLE IF NOT EXISTS users(
    id VARCHAR(20) PRIMARY KEY,
    email VARCHAR(30) UNIQUE,
    username VARCHAR(30) UNIQUE,
    password VARCHAR(256),
    token VARCHAR(32),
    isVerified BOOLEAN,
    isDisable BOOLEAN,
);


-- id => osa_userUnqID
-- firstName => osa_firstName  
-- email => osa_userMail
-- username => osa_userName
-- password => osa_passWord
-- profileURL => osa_pPicURL
-- oldToken => osa_oldToken
-- newToken => osa_newToken
-- isVerified => osa_isVerified
-- isDisable => osa_isDisabled