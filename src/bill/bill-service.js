const xss = require("xss");

const BillService = {
  getAllBills(db) {
    return db.select("*").from("bill");
  },
  getAllBudgetBills(db,bill_id) {
    return db
      .from("bill AS b")
      .select(
        "b.bill_id",
        "b.bill_name",
        "b.bill_cost",
        "b.bill_due_date",
        "b.current_status",
        "b.budget_id",
        ...budgetFields
      )
      .leftJoin("budget  AS bud", "b.budget_id", "bud.budget_id")
      .where("bud.budget_id", bill_id);
  },
  getById(db, bill_id) {
    return db
      .from("bill")
      .select("*")
      .where("bill.bill_id", bill_id)
      .first();
  },
  insertBill(db, newBill) {
    return db
      .insert(newBill)
      .into("bill")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deleteBill(db, bill_id) {
    return db("bill")
      .where({ bill_id })
      .delete();
  },
  updateBill(db, bill_id, newBillFields) {
    return db("bill")
      .where({ bill_id })
      .update(newBillFields);
  },
};
const budgetFields = [
  "bud.budget_id AS budget:budget_id",
  "bud.user_id AS budget:user_id",
  "bud.monthly_pay AS budget:monthly_pay",
  "bud.additional_income AS budget:additional_income"
];

const userFields = [
    "usr.id AS budget_users:id",
    "usr.user_name AS budget_users:user_name",
    "usr.first_name AS budget_users:full_name"
  ];

module.exports = BillService;
