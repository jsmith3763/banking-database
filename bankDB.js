const express = require('express');
const app = express();
const { Pool } = require('pg');
const PORT = process.env.PORT || 8000;

app.use(express.json());

const pool = new Pool({
    user: 'jsmith3763',
    host: 'localhost',
    database: 'bank',
    password: 'password',
    port: 5432
});

//get all
app.get('/api/accounts', async (req, res) => {
    try {
        const accounts = await pool.query('SELECT * FROM accounts');
        res.json(accounts.rows);
    } catch (error) {
        res.send(error.message);
    }
});

//get one
app.get('/api/accounts/:id', async (req, res) => {
    try {
        const accounts = await pool.query('SELECT * FROM accounts WHERE account_id = $1', [req.params.id]);
        res.json(accounts.rows);
    } catch (error) {
        res.send(error.message);
    }
});

//create one
app.post('/api/accounts', async (req, res) => {
    try {
        const objKeys = Object.keys(req.body);
        if (objKeys.length !== 4) {
            res.send("Ensure you enter account username, password, checking_balance, and saving_balance");
        } else {
            const createdAcc = await pool.query(`INSERT INTO accounts (username, password, checking_balance, saving_balance) VALUES ($1, $2, $3, $4) RETURNING *`, [req.body.username, req.body.password, req.body.checking_balance, req.body.saving_balance]);
            res.json(createdAcc.rows);
        }

    } catch (error) {
        res.send(error.message);
    }
});

//update one
app.patch('/api/accounts/:id', async (req, res) => {
    try {
        const { username, password, checking_balance, saving_balance } = req.body;
        const account = await pool.query('SELECT * FROM accounts WHERE account_id = $1', [req.params.id]);
        const accObj = {
            username: username || account.rows[0].username,
            password: password || account.rows[0].password,
            checking_balance: checking_balance || account.rows[0].checking_balance,
            saving_balance: saving_balance || account.rows[0].saving_balance
        }

        const updatedAccount = await pool.query('UPDATE accounts SET username = $1, password = $2, checking_balance = $3, saving_balance = $4 WHERE account_id = $5 RETURNING *', [accObj.username, accObj.password, accObj.checking_balance, accObj.saving_balance, req.params.id]);
        res.send(updatedAccount.rows[0]);
    } catch (error) {
        res.send(error.message);
    }
})

//delete one
app.delete('/api/accounts/:id', async (req, res) => {
    try {
        const deletedAcc = await pool.query('SELECT * FROM accounts WHERE account_id = $1', [req.params.id]);
        const deleted = await pool.query('DELETE FROM accounts WHERE account_id = $1', [req.params.id]);
        res.json(deletedAcc.rows);
    } catch (error) {
        res.send(error.message);
    }
})


app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});