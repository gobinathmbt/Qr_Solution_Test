const express = require("express");
const app = express.Router();
const student = require("../controllers/student");
const sessionMiddleware = require('../Libs/session');

// sessionMiddleware(),
 
app.get("/get_student", student.get_student);
app.post("/create_student", student.create_student);
app.put("/edit_student/:uid", student.edit_student);
app.delete("/delete_student/:uid", student.delete_student);
 
 
module.exports = app;