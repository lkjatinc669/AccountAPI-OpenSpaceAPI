CREATE TABLE IF NOT EXISTS users(
    id VARCHAR(20) PRIMARY KEY,
    email VARCHAR(30) UNIQUE,
    username VARCHAR(30) UNIQUE,
    password VARCHAR(256),
    token VARCHAR(32),
    isVerified BOOLEAN,
    isDisable BOOLEAN,
);