const express = require("express");
const app = express.Router();
const schedule = require("../controllers/schedule");
const sessionMiddleware = require('../Libs/session');

// sessionMiddleware(),
 
app.get("/get_schedule", schedule.get_schedule);
app.post("/create_schedule", schedule.create_schedule);
app.put("/edit_schedule/:uid", schedule.edit_schedule);
app.delete("/delete_schedule/:uid", schedule.delete_schedule);
 
 
module.exports = app;