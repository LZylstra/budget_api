const xss = require("xss");

const BudgetService = {
  getAllBudgets(db) {
    return db.select("*").from("budget");
  },
  getUserBudget(db,id) {
    return db
      .from("budget AS b")
      .select(
        "b.budget_id",
        "b.user_id",
        "b.monthly_pay",
        "b.additional_income",
        ...userFields
      )
      .leftJoin("budget_users AS usr", "b.user_id", "usr.id")
      .where("b.user_id", id);
  },
  getById(db, id) {
    return db
      .from("budget")
      .select("*")
      .where("budget.budget_id", id)
      .first();
  },
  insertBudget(db, newBudget) {
    return db
      .insert(newBudget)
      .into("budget")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deleteBudget(db, budget_id) {
    return db("budget")
      .where({ budget_id })
      .delete();
  },
  updateBudget(db, budget_id, newBudgetFields) {
    return db("budget")
      .where({ budget_id })
      .update(newBudgetFields);
  },
};
const userFields = [
  "usr.id AS budget_users:id",
  "usr.user_name AS budget_users:user_name",
  "usr.full_name AS budget_users:full_name"
];

module.exports = BudgetService;
