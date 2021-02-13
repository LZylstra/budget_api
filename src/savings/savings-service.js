const xss = require("xss");

const SavingsService = {
  getAllSavings(db) {
    return db.select("*").from("savings");
  },
  getAllBudgetSavings(db,savings_id) {
    return db
      .from("savings AS s")
      .select(
        "s.savings_id",
        "s.savings_name",
        "s.savings_amount",
        "s.goal_date",
        "s.goal_amount",
        "s.monthly_auto",
        "s.budget_id",
        ...budgetFields
      )
      .leftJoin("budget  AS bud", "s.budget_id", "bud.budget_id")
      .where("bud.budget_id", savings_id);
  },
  getById(db, savings_id) {
    return db
      .from("savings")
      .select("*")
      .where("savings.savings_id", savings_id)
      .first();
  },
  insertSavings(db, newSavings) {
    return db
      .insert(newSavings)
      .into("savings")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deleteSavings(db, savings_id) {
    return db("savings")
      .where({ savings_id })
      .delete();
  },
  updateSavings(db, savings_id, newSavingsFields) {
    return db("savings")
      .where({ savings_id })
      .update(newSavingsFields);
  },
};
const budgetFields = [
  "bud.budget_id AS budget:budget_id",
  "bud.user_id AS budget:user_id",
  "bud.monthly_pay AS budget:monthly_pay",
  "bud.additional_income AS budget:additional_income"
];


module.exports = SavingsService;
