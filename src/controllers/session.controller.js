import connection from "../config/db.js";

async function deleteSession(req, res) {

    const authorization = req.headers['authorization']?.replace('Bearer ', '');

    if(!authorization) return res.sendStatus(401);

    try{
        const resul = await connection.query('DELETE FROM sessions WHERE token = $1', [authorization]);
        if(resul.rowCount === 0) return res.sendStatus(404);
        res.sendStatus(200);

    }catch (error){
        res.sendStatus(500);
    }
}

export {
    deleteSession
}