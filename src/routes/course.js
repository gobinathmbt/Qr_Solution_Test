const express = require("express");
const app = express.Router();
const course = require("../controllers/course");
const sessionMiddleware = require('../Libs/session');

// sessionMiddleware(),
 
app.get("/get_course", course.get_course);
app.get("/get_course/:uid", course.get_courseby_id);
app.post("/create_course", course.create_course);
app.put("/edit_course/:uid", course.edit_course);
app.delete("/delete_course/:uid", course.delete_course);
 
 
module.exports = app;