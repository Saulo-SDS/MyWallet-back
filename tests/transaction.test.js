import "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import connection from "../src/database/database.js";
import { createCustomer } from "./factories/customer.factory.js";
import { generateTransactionBody } from "./factories/transaction.factory.js";

afterAll(async () => {
  await connection.query("DELETE FROM customer_transactions");
  await connection.query("DELETE FROM customers");
  await connection.query("DELETE FROM transactions");
});

describe("POST /user/payments/new", () => {
  it("returns 401 for no authorization", async () => {
    const body = generateTransactionBody();
    const resul = await supertest(app).post("/user/payments/new").send(body);

    expect(resul.status).toEqual(401);
  });

  it("returns 400 for invalid params", async () => {
    const user = await createCustomer();
    const userInfo = await supertest(app).post("/sign-in").send(user);

    const token = userInfo.body.token;
    const body = {};

    const resul = await supertest(app)
      .post("/user/payments/new")
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(resul.status).toEqual(400);
  });

  it("returns 201 for valid params", async () => {
    const user = await createCustomer();
    const userInfo = await supertest(app).post("/sign-in").send(user);

    const token = userInfo.body.token;
    const body = generateTransactionBody();

    const resul = await supertest(app)
      .post("/user/payments/new")
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(resul.status).toEqual(201);
  });
});

describe("GET /user/payments", () => {
  it("returns 401 for no authorization", async () => {
    const resul = await supertest(app).get("/user/payments");

    expect(resul.status).toEqual(401);
  });

  it("returns 200 for valid token", async () => {
    const user = await createCustomer();
    const userInfo = await supertest(app).post("/sign-in").send(user);

    const token = userInfo.body.token;
    const resul = await supertest(app)
      .get("/user/payments")
      .set("Authorization", `Bearer ${token}`);

    expect(resul.status).toEqual(200);
    expect(resul.body).toEqual(
      expect.objectContaining({
        transactions: expect.any(Array),
      })
    );
  });
});
