import bcrypt from "bcrypt";
import { v4 as uuid} from "uuid";
import Joi from "joi";
import connection from "../config/db.js";

const storeUser = async (req, res) => {
    
    try{

        const { name, email, password } = req.body;
        const schema = Joi.object({
            name: Joi.string()
                .required(),
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: {allow: ['com', 'net', 'br']}})
                .required(),
            password: Joi.string()
                .min(6)
                .required()
        });

        const validate = schema.validate({name, email, password});
        if(validate.error) return res.sendStatus(400);

        const user = await connection.query('SELECT * FROM users WHERE email = $1;', [email]);
        if(user.rows[0]) return res.sendStatus(409);

        const passwordHash = bcrypt.hashSync(password, 10);
        await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, passwordHash]);

        res.sendStatus(201);
    }catch{
        res.sendStatus(500);
    }
}

const getUser = async (req, res) => {

    try{
        const { email, password } = req.body;
        const resul = await connection.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = resul.rows[0];
        
        if(!user || !bcrypt.compareSync(password, user.password)) return res.sendStatus(400);

        const token = uuid();
        await connection.query('INSERT INTO sessions (id_user, token) VALUES($1, $2)', [user.id, token]);
        
        delete user.password;
        delete user.id;

        res.send({token, user});
    }catch{
        res.sendStatus(500);
    }
}


export {
    storeUser,
    getUser
};