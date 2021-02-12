require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const errorHandler = require("./middleware/error-handler");
const apikey = require("./middleware/api-key")
const authRouter = require("./auth/auth-router");
const usersRouter = require("./users/users-router");
const budgetRouter = require("./budget/budget-router")
const billRouter = require("./bill/bill-router")
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';


app.use(cors())
app.use(morgan(morganOption))
app.use(helmet())
//app.use(apikey);

app.use("/api/bill", billRouter);
app.use("/api/budget", budgetRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);


app.use(errorHandler);


module.exports = app