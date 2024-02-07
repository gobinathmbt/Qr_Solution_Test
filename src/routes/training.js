const express = require("express");
const app = express.Router();
const training = require("../controllers/training");
const sessionMiddleware = require('../Libs/session');

// sessionMiddleware(),
 
app.get("/get_training", training.get_training);
app.post("/create_training", training.create_training);
app.put("/edit_training/:uid", training.edit_training);
app.delete("/delete_training/:uid", training.delete_training);
 
 
module.exports = app;