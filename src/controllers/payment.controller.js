import connection from "../config/db.js";
import { paymentSchema } from "../Validate/schemas.js";

async function storePayment(req, res) {
    
    const { value, type, describe, date } = req.body;
    const authorization = req.headers['authorization']?.replace('Bearer ', '');

    if(!authorization) return res.sendStatus(401);

    const validate = paymentSchema.validate({value, type, describe, date});
    if(validate.error) return res.sendStatus(400);

    try{

        const resul = await connection.query('SELECT id_user FROM sessions WHERE token = $1', [authorization]);
        const id_user = resul.rows[0]?.id_user;

        if(!id_user) return res.sendStatus(401);

        await connection.query('INSERT INTO payments (id_user, value, type, date, describe) VALUES ($1, $2, $3, $4, $5)', [id_user, value, type, date, describe]);
        res.sendStatus(201);

    }catch (error){
        res.sendStatus(500);
    }
}

async function getPayments(req, res) {
    
    const authorization = req.headers['authorization']?.replace('Bearer ', '');

    if(!authorization) return res.sendStatus(401);

    try{
        const resul = await connection.query('SELECT id_user FROM sessions WHERE token = $1', [authorization]);
        const id_user = resul.rows[0]?.id_user;

        if(!id_user) return res.sendStatus(401);

        const resulPayments = await connection.query('SELECT value, type, describe, date FROM payments WHERE id_user = $1 ORDER BY id DESC', [id_user]);
        const resulSoma = await connection.query('SELECT SUM(value) AS balance FROM payments WHERE id_user = $1', [id_user]);
        
        const payments = resulPayments.rows;
        const { balance } = resulSoma.rows[0];
    
        const data = { balance, payments };
        res.send(data);

    }catch(error){
        res.sendStatus(500);
    }
}

export {
    storePayment,
    getPayments
}