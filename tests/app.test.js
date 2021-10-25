import { describe } from "jest-circus";
import supertest from "supertest";
import connection from "../src/config/db.js";
import app from "../src/app.js";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { expect } from "@jest/globals";


afterAll( async () => {
    
    await connection.query("DELETE FROM users");
    await connection.query("DELETE FROM sessions");
    await connection.query("DELETE FROM payments");

    connection.end();
});

describe("POST /sign-up", () => {

    it("returns 400 for invalid params", async () => {

        const body = {
            name: "",
            email: "teste@gmail.com",
            password: "testando123"
        }

        const resul = await supertest(app)
                            .post('/sign-up')
                            .send(body);

        expect(resul.status).toEqual(400);
    });

    it("returns 201 for valid params", async () => {

        const body = {
            name: "Teste",
            email: "teste@gmail.com",
            password: bcrypt.hashSync("testando123", 10)
        }

        const resul = await supertest(app)
                            .post('/sign-up')
                            .send(body);
       
        expect(resul.status).toEqual(201);
    });

    it("returns 409 for email conflicts", async () => {

        const body = {
            name: "Teste",
            email: "teste@gmail.com",
            password: "testando123"
        }

        const resul = await supertest(app)
                            .post('/sign-up')
                            .send(body);

        expect(resul.status).toEqual(409);
    });

});

describe("GET /sign-in", () => {

    it("returns 200 for valid params", async () => {

        const values = ['Teste2', 'teste2@gmail.com', bcrypt.hashSync("123456789", 10)];
        await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', values);

        const body = {
            email: "teste2@gmail.com",
            password: "123456789"
        }

        const resul = await supertest(app)
                            .post('/sign-in')
                            .send(body);
        expect(resul.status).toEqual(200);
        expect(resul.body).toEqual(expect.objectContaining({
            token: expect.any(String),
            user: {
                name: expect.any(String)
            }
        }));
    });

    it("returns 400 for bad params", async () => {
    
        const body = {
            email: "superteste@gmail.com",
            password: "12345678"
        }

        const resul = await supertest(app)
                            .post('/sign-in')
                            .send(body);
                            
        expect(resul.status).toEqual(400);
    });
});


describe("DELETE /user/logout", () => {

    it("returns 401 for no authorization", async () => {

        const values = ['sessionteste', 'sessionteste@gmail.com', bcrypt.hashSync("123456789", 10)];
        await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', values);


        const resul = await supertest(app)
                            .delete('/user/logout');

        expect(resul.status).toEqual(401);
    });

    it("returns 404 no exits token", async () => {

        const resul = await supertest(app)
                            .delete('/user/logout')
                            .set('Authorization', 'Bearer xxxxx');
                            
        expect(resul.status).toEqual(404);
    });

    it("returns 200 for valid token", async () => {
        
        const values = ['sessionteste', 'sessionteste@gmail.com', bcrypt.hashSync("123456789", 10)];
        await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', values);

        const body = {
            email: "sessionteste@gmail.com",
            password: "123456789"
        }

        const userInfo = await supertest(app)
                               .post('/sign-in')
                               .send(body);
        const token = userInfo.body.token;
   
        const resul = await supertest(app)
                            .delete('/user/logout')
                            .set('Authorization', `Bearer ${token}`);

        expect(resul.status).toEqual(200);
      });
});


describe("POST /user/payments/new", () => {

    it("returns 401 for no authorization", async () => {
     
        const body = {
            value: 500.56,
            type: "entry",
            date: "2021-10-22"
        }

        const resul = await supertest(app)
                            .post('/user/payments/new')
                            .send(body);

        expect(resul.status).toEqual(401);
    });

    it("returns 400 for invalid params", async () => {

        const values = ['paymentteste', 'paymentteste@gmail.com', bcrypt.hashSync("123456789", 10)];
        await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', values);

        const userBody = {
            email: "paymentteste@gmail.com",
            password: "123456789"
        }

        const userInfo = await supertest(app)
                               .post('/sign-in')
                               .send(userBody);

        const token = userInfo.body.token;
   
        const body = {
            value: 35.56,
            type: "exit",
            date: "2022-10-22"
        }

        const resul = await supertest(app)
                            .post('/user/payments/new')
                            .send(body)
                            .set('Authorization', `Bearer ${token}`);
                            
        expect(resul.status).toEqual(400);
    });


    
    it("returns 201 for valid params", async () => {
       
        const values = ['paymentteste123', 'paymentteste123@hotmail.com', bcrypt.hashSync("123456789", 10)];
        await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', values);

        const userBody = {
            email: "paymentteste123@hotmail.com",
            password: "123456789"
        }

        const userInfo = await supertest(app)
                               .post('/sign-in')
                               .send(userBody);

        const token = userInfo.body.token;
   
        const body = {
            value: 1500.99,
            type: "entry",
            describe: "Money do freelancer uhuuu",
            date: dayjs().format('YYYY-MM-DD')
        }

        const resul = await supertest(app)
                            .post('/user/payments/new')
                            .send(body)
                            .set('Authorization', `Bearer ${token}`);
                            
        expect(resul.status).toEqual(201);
      });
});



describe("GET /user/payments", () => {

    it("returns 401 for no authorization", async () => {
     
        const resul = await supertest(app)
                            .get('/user/payments');

        expect(resul.status).toEqual(401);
    });

   
    it("returns 200 for valid token", async () => {

        const values = ['payementsget', 'payementsget@gmail.com', bcrypt.hashSync("123456789", 10)];
        await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', values);

        const body = {
            email: "payementsget@gmail.com",
            password: "123456789"
        }

        const userInfo = await supertest(app)
                            .post('/sign-in')
                            .send(body);

        const token = userInfo.body.token;
        const resul = await supertest(app)
                            .get('/user/payments')
                            .set('Authorization', `Bearer ${token}`);

        expect(resul.status).toEqual(200);
        expect(resul.body).toEqual(expect.objectContaining({
            payments: expect.any(Array)
        }));
    });
});
