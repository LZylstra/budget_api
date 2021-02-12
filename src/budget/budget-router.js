const express = require("express");
const logger = require("../middleware/logger");
const xss = require("xss");
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");
const BudgetService = require("./budget-service");
const BudgetRouter = express.Router();

const serializeBudget = (budget) => ({
  id: budget.id,
  monthly_pay: budget.monthly_pay,
  additional_income: budget.additional_income,
  user_id: budget.user_id
  
});

// Get all budgets
BudgetRouter.route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    BudgetService.getAllBudgets(req.app.get("db"))
      .then((budget) => {
        res.json(budget.map(serializeBudget));
      })
      .catch(next);
  });

// Get budgets for the logged in user
BudgetRouter.route("/user/:user_id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { user_id } = req.params;
    BudgetService.getUserBudget(req.app.get("db"), user_id)
      .then((budgets) => {
        if (!budgets) {
          logger.error(`Budget with user id ${user_id} not found.`);
          return res.status(404).json({
            error: { message: `Budget not found` },
          });
        }
        res.json(budgets.map(serializeBudget));
      })
      .catch(next);
  })

  // Add a new Budget
  .post(bodyParser, (req, res, next) => {
    const {
      monthly_pay,
      additional_income

    } = req.body;
    const { user_id } = req.params;
    const newbudget = {
        monthly_pay,
        additional_income,
        user_id
    };

    BudgetService.insertBudget(req.app.get("db"), newbudget)
      .then((budget) => {
        res.status(201).location(`/`).json(serializeBudget(budget));
      })
      .catch(next);
  });

// Get budget by id
BudgetRouter.route("/:id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.params;
    BudgetService.getById(req.app.get("db"), id)
      .then((budget) => {
        if (!budget) {
          logger.error(`Budget with id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Budget Not Found` },
          });
        }
        res.json(serializeBudget(budget));
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { id } = req.params;
    let {
      monthly_pay,
      additional_income
    } = req.body;

    const updatedBudget = {
        monthly_pay,
        additional_income
    };


    BudgetService.updateBudget(req.app.get("db"), id, updatedBudget)
      .then((budget) => {
        if (!budget) {
          logger.error(`Budget with id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Budget Not Found` },
          });
        }
        res.status(201).location(`/`).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    BudgetService.deleteBudget(req.app.get("db"), id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch((err) => {
        console.log(err).next();
      });
  });

module.exports = BudgetRouter;
