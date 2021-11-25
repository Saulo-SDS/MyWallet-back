import * as transactionRepository from "../repositories/transaction.repository.js";

async function createTransaction({ id, value, type, date, describe }) {
  await transactionRepository.create({ id, value, type, date, describe });
}

async function listFinances({ id }) {
  const finances = await transactionRepository.getAllFinancesForUser({ id });
  return finances;
}

async function sumTransactions({ id }) {
  const sum = await transactionRepository.getSumTransactionsUser({ id });
  return sum;
}
export { createTransaction, listFinances, sumTransactions };
