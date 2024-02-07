const mongoose = require("mongoose");


const courseSchema = mongoose.Schema({
  uid: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  is_active: { type: Boolean, default: true, },
  is_deleted: { type: Boolean, default: false, },
  created_by: { type: String, default: null, },
  updated_by: { type: String, default: null, },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
});

courseSchema.pre('save', function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

const studentSchema = mongoose.Schema({
  uid: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  is_active: { type: Boolean, default: true, },
  is_deleted: { type: Boolean, default: false, },
  created_by: { type: String, default: null, },
  updated_by: { type: String, default: null, },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
});

studentSchema.pre('save', function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

const scheduleSchema = mongoose.Schema({
  uid: { type: String, required: true },
  course_id: { type: String, required: true },
  start_date: { type: String, required: true },
  end_date: { type: String, required: true },
  instructor: { type: String, required: true },
  is_active: { type: Boolean, default: true, },
  is_deleted: { type: Boolean, default: false, },
  created_by: { type: String, default: null, },
  updated_by: { type: String, default: null, },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
});

scheduleSchema.pre('save', function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});



const userSchema = mongoose.Schema({
  uid: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now }
});

userSchema.pre('save', function(next) {
  const now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

const studentTrainingSchema = mongoose.Schema({
  uid: { type: String, required: true },
  email: { type: String, required: true },
  course_id: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now }
});

studentTrainingSchema.pre('save', function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

module.exports = {
  Course: mongoose.model("courses", courseSchema),
  User: mongoose.model("users", userSchema),
  Student: mongoose.model("students", studentSchema),
  Schedule: mongoose.model("schedule", scheduleSchema),
  StudentTraining : mongoose.model("StudentTraining", studentTrainingSchema),
};
