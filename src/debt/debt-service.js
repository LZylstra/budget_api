const xss = require("xss");

const DebtService = {
  getAllDebt(db) {
    return db.select("*").from("debt");
  },
  getAllBudgetDebt(db,debt_id) {
    return db
      .from("debt AS d")
      .select(
        "d.debt_id",
        "d.debt_name",
        "d.debt_balance",
        "d.debt_due_date",
        "d.current_status",
        "d.interest_rate",
        "d.debt_min_payment",
        "d.budget_id",
        ...budgetFields
      )
      .leftJoin("budget AS bud", "d.budget_id", "bud.budget_id")
      .where("bud.budget_id", debt_id);
  },
  getById(db, debt_id) {
    return db
      .from("debt")
      .select("*")
      .where("debt.debt_id", debt_id)
      .first();
  },
  insertDebt(db, newDebt) {
    return db
      .insert(newDebt)
      .into("debt")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deleteDebt(db, debt_id) {
    return db("debt")
      .where({ debt_id })
      .delete();
  },
  updateDebt(db, debt_id, newDebtFields) {
    return db("debt")
      .where({ debt_id })
      .update(newDebtFields);
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

module.exports = DebtService;
