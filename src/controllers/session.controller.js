import connection from "../config/db.js";

const deleteSession = async (req, res) => {

    try{
        const { token } = req.params;
        const resul = await connection.query('DELETE FROM sessions WHERE token = $1', [token]);
        
        if(resul.rowCount === 0) return res.sendStatus(404);
        res.sendStatus(200);
    }catch{
        res.sendStatus(500);
    }
}

export {
    deleteSession
}