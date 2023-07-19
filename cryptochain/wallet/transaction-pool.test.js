const TransactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Wallet = require(".");

describe("TransactionPool", () => {
  let transactionPool, transaction;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    transaction = new Transaction({
      senderWallet: new Wallet(),
      recipient: "fake-recipient",
      amount,
    });
  });
});
