/**
 * @file Bootstrap express.js server
 */

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const router = require("../app/routes");
const app = express();

/* .env variables */
require("dotenv").config();

/* Middlewares cors */
app.use(cors());

/** Install request logger */
app.use(morgan("dev"));

/** Install body parser */
app.use(express.urlencoded({ extended: true }));

/** Install JSON request parser */
app.use(express.json());

/** Install Router */
app.use(router);

module.exports = app;