const xss = require("xss");

const BillService = {
  getAllBills(db) {
    return db.select("*").from("bill");
  },
  getAllBudgetBills(db,id) {
    return db
      .from("bill AS b")
      .select(
        "b.id",
        "b.bill_name",
        "b.bill_cost",
        "b.bill_due_date",
        "b.current_status",
        "budget_id",
        ...budgetFields
      )
      .leftJoin("budget  AS bud", "budget_id", "bud.id")
      .where("bud.id", id);
  },
  getById(db, id) {
    return db
      .from("bill")
      .select("*")
      .where("bill.id", id)
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
  deleteBill(db, id) {
    return db("bill")
      .where({ id })
      .delete();
  },
  updateBill(db, id, newBillFields) {
    return db("bill")
      .where({ id })
      .update(newBillFields);
  },
};
const budgetFields = [
  "bud.id AS budget:id",
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
