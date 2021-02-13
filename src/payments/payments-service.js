const xss = require("xss");

const PaymentService = {
  getAllPayments(db) {
    return db.select("*").from("payments");
  },
  getAllBillPayments(db,bill_id) {
    return db
      .from("payments AS p")
      .select(
        "p.payments_id",
        "p.payment_type",
        "p.payment_note",
        "p.payment_date",
        "p.payment_amount",
        "p.bill_id",
        ...billFields
      )
      .leftJoin("bill", "p.bill_id", "bill.bill_id")
      .where("p.bill_id", bill_id);
  },
  getAllDebtPayments(db,debt_id) {
    return db
    .from("payments AS p")
    .select(
      "p.payments_id",
      "p.payment_type",
      "p.payment_note",
      "p.payment_date",
      "p.payment_amount",
      "p.debt_id",
      ...debtFields
    )
    .leftJoin("debt", "p.debt_id", "debt.debt_id")
    .where("p.debt_id", debt_id);
  },
  getAllSavingsPayments(db,savings_id) {
    return db
    .from("payments AS p")
    .select(
      "p.payments_id",
      "p.payment_type",
      "p.payment_note",
      "p.payment_date",
      "p.payment_amount",
      "p.savings_id",
      ...savingsFields
    )
    .leftJoin("savings", "p.savings_id", "savings.savings_id")
    .where("p.savings_id", savings_id);
  },
  getById(db, payments_id) {
    return db
      .from("payments")
      .select("*")
      .where("payments.payments_id", payments_id)
      .first();
  },
  insertPayment(db, newPayment) {
    return db
      .insert(newPayment)
      .into("payments")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deletePayment(db, payments_id) {
    return db("payments")
      .where({ payments_id })
      .delete();
  },
  updatePayment(db, payments_id, newPaymentFields) {
    return db("payments")
      .where({ payments_id })
      .update(newPaymentFields);
  },
};
const budgetFields = [
  "bud.budget_id AS budget:budget_id",
  "bud.user_id AS budget:user_id",
  "bud.monthly_pay AS budget:monthly_pay",
  "bud.additional_income AS budget:additional_income"
];

const billFields = [
    "bill.bill_id",
    "bill.bill_name",
    "bill.bill_cost",
    "bill.bill_due_date",
    "bill.current_status",
    "bill.budget_id"
  ];

  const debtFields = [
      "debt.debt_id",
      "debt.debt_name",
      "debt.debt_balance",
      "debt.debt_due_date",
      "debt.current_status",
      "debt.interest_rate",
      "debt.debt_min_payment",
      "debt.budget_id"
  ]

  const savingsFields = [
      "savings.savings_id",
      "savings.savings_name",
      "savings.goal_date",
      "savings.goal_amount",
      "savings.monthly_auto",
      "savings.budget_id"
  ]

module.exports = PaymentService;
