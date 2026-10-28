const transactions = [
  { id: 1, customer: "Almaz", amount: 250, type: "debit" },
  { id: 2, customer: "Grace", amount: 600, type: "credit" },
  { id: 3, customer: "John", amount: 180, type: "debit" },
  { id: 4, customer: "Abebe", amount: 1200, type: "credit" },
  { id: 5, customer: "Aman", amount: 450, type: "credit" },
];


const totalByType = (txns, type) =>
  txns
    .filter((t) => t.type === type)
    .reduce((sum, { amount }) => sum + amount, 0);


const formatReceipts = (txns) =>
  txns.map(
    ({ customer, amount, type }) =>
      `Receipt for ${customer}: ${amount} ETB (${type.toUpperCase()})`
  );

const updateTransactionAmount = (txns, targetId, newAmount) =>
  txns.map((txn) =>
    txn.id === targetId ? { ...txn, amount: newAmount } : txn
  );

console.log("Telebirr transaction reportr");

const totalCredits = totalByType(transactions, "credit");
const totalDebits = totalByType(transactions, "debit");

console.log(`Total Credits: ${totalCredits} ETB`);
console.log(`Total Debits:  ${totalDebits} ETB`);
console.log(`Net Balance:   ${totalCredits - totalDebits} ETB\n`);

console.log("Receipt");
const receipts = formatReceipts(transactions);
receipts.forEach((receipt) => console.log(receipt));
console.log("\n Correcting Transaction #1 Amount");
const updatedTransactions = updateTransactionAmount(transactions, 1, 300);

console.log("Original Txn #1:", transactions[0]);
console.log("Updated Txn #1: ", updatedTransactions[0]);