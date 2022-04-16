const express = require("express");
const logger = require("../middleware/logger");
const xss = require("xss");
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");
const AccountService = require("./account-service");
const AccountRouter = express.Router();

const serializeaccount = (account) => ({
  account_id: account.account_id,
  account_name: xss(account.account_name),
  account_amount: account.account_amount,
  goal_date: account.goal_date,
  goal_amount: account.goal_amount,
  monthly_auto: account.monthly_auto,
  account_type: account.account_type,
  budget_id: account.budget_id
});

// Get all account
AccountRouter.route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    AccountService.getAllAccounts(req.app.get("db"))
      .then((account) => {
        res.json(account.map(serializeaccount));
      })
      .catch(next);
  });

// Get all account for a given budget 
AccountRouter.route("/budget/:budget_id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { budget_id } = req.params;
    AccountService.getAllBudgetAccounts(req.app.get("db"), budget_id)
      .then((account) => {
        if (!account) {
          logger.error(`account with budget id ${budget_id} not found.`);
          return res.status(404).json({
            error: { message: `account not found` },
          });
        }
        res.json(account.map(serializeaccount));
      })
      .catch(next);
  })

  // Add a new account
  .post(bodyParser, (req, res, next) => {
    const {
      account_name,
      account_amount,
      goal_date,
      goal_amount,
      account_type,
      monthly_auto
      
    } = req.body;
    const { budget_id } = req.params;

    const newaccount = {
        account_name,
        account_amount,
        goal_date,
        goal_amount,
        monthly_auto,
        account_type,
        budget_id
    };

    if (!req.body.account_name) {
      logger.error(`account name is required`);
      return res.status(400).send(`'account_name' is required`);
    }

    // if (!req.body.goal_date) {
    //   logger.error(`Goal date is required`);
    //   return res.status(400).send(`'goal_date' is required`);
    // }

    AccountService.insertAccount(req.app.get("db"), newaccount)
      .then((account) => {
        res.status(201).location(`/`).json(serializeaccount(account));
      })
      .catch(next);
  });

// Get account by id
AccountRouter.route("/:account_id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { account_id } = req.params;
    AccountService.getById(req.app.get("db"), account_id)
      .then((account) => {
        if (!account) {
          logger.error(`account with id ${account_id} not found.`);
          return res.status(404).json({
            error: { message: `account Not Found` },
          });
        }
        res.json(serializeaccount(account));
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { account_id } = req.params;
    let {
        account_name,
        account_amount,
        goal_date,
        goal_amount,
        monthly_auto,
        account_type,
        budget_id
    } = req.body;

    const updatedaccount = {
        account_name,
        account_amount,
        goal_date,
        goal_amount,
        monthly_auto,
        account_type,
        budget_id
    };


    AccountService.updateAccounts(req.app.get("db"), account_id, updatedaccount)
      .then((account) => {
        if (!account) {
          logger.error(`account with id ${account_id} not found.`);
          return res.status(404).json({
            error: { message: `account Not Found` },
          });
        }
        res.status(201).location(`/`).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { account_id } = req.params;

    AccountService.deleteAccount(req.app.get("db"), account_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch((err) => {
        console.log(err).next();
      });
  });

module.exports = AccountRouter;
