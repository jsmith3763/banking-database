DROP DATABASE IF EXISTS bank;
CREATE DATABASE bank;
\c bank
DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
    account_id serial PRIMARY KEY,
    username varchar(20),
    password varchar(20),
    checking_balance integer,
    saving_balance integer
);