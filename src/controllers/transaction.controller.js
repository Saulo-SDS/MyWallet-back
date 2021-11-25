import { paymentSchema } from "../Validate/schemas.js";
import * as transactionService from "../service/transaction.service.js";

async function storeTransaction(req, res) {
  const { value, type, describe, date } = req.body;
  const { id } = req;
  const validate = paymentSchema.validate({ value, type, date, describe });
  if (validate.error) return res.sendStatus(400);

  try {
    await transactionService.createTransaction({
      id,
      value,
      type,
      date,
      describe,
    });

    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
  }
}

async function getTransactions(req, res) {
  const { id } = req;

  try {
    const transactions = await transactionService.listFinances({ id });
    const balance = await transactionService.sumTransactions({ id });

    const data = { transactions, balance };
    res.send(data);
  } catch (error) {
    res.sendStatus(500);
  }
}

export { storeTransaction, getTransactions };
