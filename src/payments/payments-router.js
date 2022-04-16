const express = require("express");
const logger = require("../middleware/logger");
const xss = require("xss");
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");
const PaymentService = require("./payments-service");
const PaymentRouter = express.Router();

const serializePayment = (payments) => ({
  payments_id: payments.payments_id,
  payment_type: xss(payments.payment_type),
  payment_note: xss(payments.payment_note),
  payment_date: payments.payment_date,
  payment_amount: payments.payment_amount,
  debt_id: payments.debt_id,
  bill_id: payments.bill_id,
  account_id: payments.account_id
});

// Get all payments
PaymentRouter.route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    PaymentService.getAllPayments(req.app.get("db"))
      .then((payments) => {
        res.json(payments.map(serializePayment));
      })
      .catch(next);
  });

// Get all payments for a given bill
PaymentRouter.route("/bill/:bill_id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { bill_id } = req.params;
    PaymentService.getAllBillPayments(req.app.get("db"), bill_id)
      .then((payments) => {
        if (!payments) {
          logger.error(`Payment with bill id ${bill_id} not found.`);
          return res.status(404).json({
            error: { message: `Payment not found` },
          });
        }
        res.json(payments.map(serializePayment));
      })
      .catch(next);
  })
  // Add a new payments
  .post(bodyParser, (req, res, next) => {
    const {
        payment_type,
        payment_note,
        payment_date,
        payment_amount
    } = req.body;
    const { bill_id } = req.params;
    const newPayment = {
        payment_type,
        payment_note,
        payment_date,
        payment_amount,
        bill_id
    };

      // !!! need to add error checking to be sure type is the expected bill type

    if (!req.body.payment_type) {
      logger.error(`Payment type is required`);
      return res.status(400).send(`'payment_type' is required`);
    }
    
    if (!req.body.payment_amount) {
        logger.error(`Payment amount is required`);
        return res.status(400).send(`'payment_amount' is required`);
      }

    PaymentService.insertPayment(req.app.get("db"), newPayment)
      .then((payments) => {
        res.status(201).location(`/`).json(serializePayment(payments));
      })
      .catch(next);
  });

// Get all payments for a given debt
PaymentRouter.route("/debt/:debt_id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { debt_id } = req.params;
    PaymentService.getAllDebtPayments(req.app.get("db"), debt_id)
      .then((payments) => {
        if (!payments) {
          logger.error(`Payment with debt id ${debt_id} not found.`);
          return res.status(404).json({
            error: { message: `Payment not found` },
          });
        }
        res.json(payments.map(serializePayment));
      })
      .catch(next);
  })
  // Add a new payments
  .post(bodyParser, (req, res, next) => {
    const {
        payment_type,
        payment_note,
        payment_date,
        payment_amount
    } = req.body;
    const { debt_id } = req.params;
    const newPayment = {
        payment_type,
        payment_note,
        payment_date,
        payment_amount,
        debt_id
    };

      // !!! need to add error checking to be sure type is the expected debt type

    if (!req.body.payment_type) {
      logger.error(`Payment type is required`);
      return res.status(400).send(`'payment_type' is required`);
    }
    
    if (!req.body.payment_amount) {
        logger.error(`Payment amount is required`);
        return res.status(400).send(`'payment_amount' is required`);
      }

    PaymentService.insertPayment(req.app.get("db"), newPayment)
      .then((payments) => {
        res.status(201).location(`/`).json(serializePayment(payments));
      })
      .catch(next);
  });

  // Get all payments for a given account
PaymentRouter.route("/account/:account_id")
.all(requireAuth)
.get((req, res, next) => {
  const { account_id } = req.params;
  PaymentService.getAllaccountPayments(req.app.get("db"), account_id)
    .then((payments) => {
      if (!payments) {
        logger.error(`Payment with account id ${account_id} not found.`);
        return res.status(404).json({
          error: { message: `Payment not found` },
        });
      }
      res.json(payments.map(serializePayment));
    })
    .catch(next);
})
// Add a new payments
.post(bodyParser, (req, res, next) => {
  const {
      payment_type,
      payment_note,
      payment_date,
      payment_amount
  } = req.body;
  const { account_id } = req.params;
  const newPayment = {
      payment_type,
      payment_note,
      payment_date,
      payment_amount,
      account_id
  };

  // !!! need to add error checking to be sure type is the expected account type

  if (!req.body.payment_type) {
    logger.error(`Payment type is required`);
    return res.status(400).send(`'payment_type' is required`);
  }
  
  if (!req.body.payment_amount) {
      logger.error(`Payment amount is required`);
      return res.status(400).send(`'payment_amount' is required`);
    }

  PaymentService.insertPayment(req.app.get("db"), newPayment)
    .then((payments) => {
      res.status(201).location(`/`).json(serializePayment(payments));
    })
    .catch(next);
});



// Get payments by id
PaymentRouter.route("/:id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.params;
    PaymentService.getById(req.app.get("db"), id)
      .then((payments) => {
        if (!payments) {
          logger.error(`Payment with id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Payment Not Found` },
          });
        }
        res.json(serializePayment(payments));
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { id } = req.params;
    let {
        payment_type,
        payment_note,
        payment_date,
        payment_amount,
        bill_id,
        account_id,
        debt_id
    } = req.body;

    const updatedPayment = {
        payment_type,
        payment_note,
        payment_date,
        payment_amount,
        bill_id,
        account_id,
        debt_id
    };


    PaymentService.updatePayment(req.app.get("db"), id, updatedPayment)
      .then((payments) => {
        if (!payments) {
          logger.error(`Payment with id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Payment Not Found` },
          });
        }
        res.status(201).location(`/`).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    PaymentService.deletePayment(req.app.get("db"), id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch((err) => {
        console.log(err).next();
      });
  });

module.exports = PaymentRouter;
