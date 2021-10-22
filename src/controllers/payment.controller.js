import connection from "../config/db.js";
import joi from "joi";
import JoiDate from "@hapi/joi-date";
import dayjs from "dayjs";
import moment from "moment";

const storePayment = async (req, res) => {
    
    const Joi = joi.extend(JoiDate);
    const { value, type, date } = req.body;
    const authorization = req.headers['authorization']?.replace('Bearer ', '');

    if(!authorization) return res.sendStatus(401);

    const now = dayjs().format('DD/MM/YYYY');

    const schema = Joi.object({
        value: Joi.number()
            .required(),
        type: Joi.string()
            .valid('entry', 'exit')
            .required(),
        date: Joi.date()
            .format('YYYY-MM-DD')
            .max('now')
            .min(moment().format('YYYY-MM-DD'))
            .required()
    });

    const validate = schema.validate({value, type, date});
    if(validate.error) return res.sendStatus(400);

    try{

        const resul = await connection.query('SELECT id_user FROM sessions WHERE token = $1', [authorization]);
        const id_user = resul.rows[0]?.id_user;

        if(!id_user) return res.sendStatus(401);

        await connection.query('INSERT INTO payments (id_user, value, type, date) VALUES ($1, $2, $3, $4)', [id_user, value, type, date]);
        res.sendStatus(201);

    }catch (error){
        res.sendStatus(500);
    }
}

const getPayments = async (req, res) => {
    
    const Joi = joi.extend(JoiDate);
    const authorization = req.headers['authorization']?.replace('Bearer ', '');

    if(!authorization) return res.sendStatus(401);

    try{
        const resul = await connection.query('SELECT id_user FROM sessions WHERE token = $1', [authorization]);
        const id_user = resul.rows[0]?.id_user;

        if(!id_user) return res.sendStatus(401);

        const resulPayments = await connection.query('SELECT value, type, date FROM payments WHERE id_user = $1 ORDER BY id DESC', [id_user]);
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