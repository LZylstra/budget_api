const xss = require("xss");

const AccountService = {
  getAllAccounts(db) {
    return db.select("*").from("accounts");
  },
  getAllBudgetAccounts(db,account_id) {
    return db
      .from("accounts AS s")
      .select(
        "s.account_id",
        "s.account_name",
        "s.account_amount",
        "s.goal_date",
        "s.goal_amount",
        "s.monthly_auto",
        "s.account_type",
        "s.budget_id",
        ...budgetFields
      )
      .leftJoin("budget  AS bud", "s.budget_id", "bud.budget_id")
      .where("bud.budget_id", account_id);
  },
  getById(db, account_id) {
    return db
      .from("accounts")
      .select("*")
      .where("accounts.account_id", account_id)
      .first();
  },
  insertAccount(db, newAccounts) {
    return db
      .insert(newAccounts)
      .into("accounts")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deleteAccount(db, account_id) {
    return db("accounts")
      .where({ account_id })
      .delete();
  },
  updateAccounts(db, account_id, newAccountsFields) {
    return db("accounts")
      .where({ account_id })
      .update(newAccountsFields);
  },
};
const budgetFields = [
  "bud.budget_id AS budget:budget_id",
  "bud.user_id AS budget:user_id",
  "bud.monthly_pay AS budget:monthly_pay",
  "bud.additional_income AS budget:additional_income"
];


module.exports = AccountService;
