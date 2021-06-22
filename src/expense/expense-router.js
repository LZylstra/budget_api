const express = require("express");
const logger = require("../middleware/logger");
const xss = require("xss");
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");
const ExpenseService = require("./expense-service");
const ExpenseRouter = express.Router();

const serializeExpense = (expense) => ({
  expense_id: expense.expense_id,
  expense_desc: xss(expense.expense_desc),
  expense_amount: expense.expense_amount,
  expense_date: expense.expense_date,
  expense_type: xss(expense.expense_type),
  category_id: expense.category_id
});

// Get all expenses
ExpenseRouter.route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    ExpenseService.getAllExpenses(req.app.get("db"))
      .then((expenses) => {
        res.json(expenses.map(serializeExpense));
      })
      .catch(next);
  });

// Get all expenses for a given category 
ExpenseRouter.route("/category/:category_id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { category_id } = req.params;
    ExpenseService.getAllCategoryExpenses(req.app.get("db"), category_id)
      .then((expenses) => {
        if (!expenses) {
          logger.error(`Expense with category id ${category_id} not found.`);
          return res.status(404).json({
            error: { message: `Expense not found` },
          });
        }
        res.json(expenses.map(serializeExpense));
      })
      .catch(next);
  })

  // Add a new expense
  .post(bodyParser, (req, res, next) => {
    const {
        expense_amount,
        expense_date,
        expense_desc,
        expense_type
    } = req.body;
    const { category_id } = req.params;
    const newExpense = {
        expense_amount,
        expense_date,
        expense_desc,
        expense_type,
        category_id
    };

    if (!req.body.expense_amount) {
      logger.error(`Expense amount is required`);
      return res.status(400).send(`'expense_amount' is required`);
    }

    if (!req.body.expense_type) {
        logger.error(`Expense type is required`);
        return res.status(400).send(`'expense_type' is required`);
      }
  

    ExpenseService.insertExpense(req.app.get("db"), newExpense)
      .then((expense) => {
        res.status(201).location(`/`).json(serializeExpense(expense));
      })
      .catch(next);
  });

// Get expense by id
ExpenseRouter.route("/:id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.params;
    ExpenseService.getById(req.app.get("db"), id)
      .then((expense) => {
        if (!expense) {
          logger.error(`Expense with id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Expense Not Found` },
          });
        }
        res.json(serializeExpense(expense));
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { id } = req.params;
    let {
        expense_amount,
        expense_date,
        expense_desc,
        expense_type,
        category_id
    } = req.body;

    const updatedExpense = {
        expense_amount,
        expense_date,
        expense_desc,
        expense_type,
        category_id
    };


    ExpenseService.updateExpense(req.app.get("db"), id, updatedExpense)
      .then((expense) => {
        if (!expense) {
          logger.error(`Expense with id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Expense Not Found` },
          });
        }
        res.status(201).location(`/`).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    ExpenseService.deleteExpense(req.app.get("db"), id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch((err) => {
        console.log(err).next();
      });
  });

module.exports = ExpenseRouter;
