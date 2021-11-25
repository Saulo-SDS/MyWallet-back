import "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import connection from "../src/database/database.js";
import {
  createCustomer,
  generateCustomerBody,
} from "./factories/customer.factory.js";

afterAll(async () => {
  await connection.query("DELETE FROM customer_transactions");
  await connection.query("DELETE FROM customers");
});

describe("POST /sign-up", () => {
  it("returns 400 for invalid params", async () => {
    const body = {};
    const resul = await supertest(app).post("/sign-up").send(body);
    expect(resul.status).toEqual(400);
  });

  it("returns 201 for valid params", async () => {
    const body = generateCustomerBody({ email: "test@gmail.com" });

    const resul = await supertest(app).post("/sign-up").send(body);

    expect(resul.status).toEqual(201);
  });

  it("returns 409 for email conflicts", async () => {
    const body = generateCustomerBody({ email: "test@gmail.com" });
    const resul = await supertest(app).post("/sign-up").send(body);

    expect(resul.status).toEqual(409);
  });
});

describe("POST /sign-in", () => {
  it("returns 200 for valid params", async () => {
    const body = await createCustomer();

    const resul = await supertest(app).post("/sign-in").send(body);
    expect(resul.status).toEqual(200);
    expect(resul.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        name: expect.any(String),
      })
    );
  });

  it("returns 400 for bad params", async () => {
    const body = {};

    const resul = await supertest(app).post("/sign-in").send(body);
    expect(resul.status).toEqual(400);
  });
});
