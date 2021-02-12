const express = require("express");
const logger = require("../middleware/logger");
const xss = require("xss");
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");
const DebtService = require("./debt-service");
const DebtRouter = express.Router();

const serializeDebt = (debt) => ({
  debt_id: debt.debt_id,
  debt_name: xss(debt.debt_name),
  debt_balance: debt.balance,
  debt_due_date: debt.debt_due_date,
  current_status: debt.current_status,
  interest_rate: debt.interest_rate,
  debt_min_payment: debt.debt_min_payment,
  budget_id: debt.budget_id
});

// Get all debt
DebtRouter.route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    DebtService.getAllDebt(req.app.get("db"))
      .then((debt) => {
        res.json(debt.map(serializeDebt));
      })
      .catch(next);
  });

// Get all debt for a given budget 
DebtRouter.route("/budget/:budget_id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { budget_id } = req.params;
    DebtService.getAllBudgetDebt(req.app.get("db"), budget_id)
      .then((debt) => {
        if (!debt) {
          logger.error(`Debt with budget id ${budget_id} not found.`);
          return res.status(404).json({
            error: { message: `Debt not found` },
          });
        }
        res.json(debt.map(serializeDebt));
      })
      .catch(next);
  })

  // Add a new debt
  .post(bodyParser, (req, res, next) => {
    const {
        debt_name,
        balance,
        debt_due_date,
        current_status,
        interest_rate,
        debt_min_payment   
    } = req.body;
    const { budget_id } = req.params;

    const newDebt = {
        debt_name,
        balance,
        debt_due_date,
        current_status,
        interest_rate,
        debt_min_payment,   
        budget_id
    };

    if (!req.body.debt_name) {
      logger.error(`Debt name is required`);
      return res.status(400).send(`'debt_name' is required`);
    }

    if (!req.body.debt_due_date) {
      logger.error(`Debt due date is required`);
      return res.status(400).send(`'debt_due_date' is required`);
    }

    DebtService.insertDebt(req.app.get("db"), newDebt)
      .then((debt) => {
        res.status(201).location(`/`).json(serializeDebt(debt));
      })
      .catch(next);
  });

// Get debt by id
DebtRouter.route("/:debt_id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { debt_id } = req.params;
    DebtService.getById(req.app.get("db"), debt_id)
      .then((debt) => {
        if (!debt) {
          logger.error(`Debt with id ${debt_id} not found.`);
          return res.status(404).json({
            error: { message: `Debt Not Found` },
          });
        }
        res.json(serializeDebt(debt));
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { debt_id } = req.params;
    let {
        debt_name,
        balance,
        debt_due_date,
        current_status,
        interest_rate,
        debt_min_payment,  
        budget_id
    } = req.body;

    const updatedDebt = {
        debt_name,
        balance,
        debt_due_date,
        current_status,
        interest_rate,
        debt_min_payment,  
        budget_id
    };


    DebtService.updateDebt(req.app.get("db"), debt_id, updatedDebt)
      .then((debt) => {
        if (!debt) {
          logger.error(`Debt with id ${debt_id} not found.`);
          return res.status(404).json({
            error: { message: `Debt Not Found` },
          });
        }
        res.status(201).location(`/`).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { debt_id } = req.params;

    DebtService.deleteDebt(req.app.get("db"), debt_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch((err) => {
        console.log(err).next();
      });
  });

module.exports = DebtRouter;
