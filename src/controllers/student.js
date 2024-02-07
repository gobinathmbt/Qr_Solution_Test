const crypto = require('crypto');
const Student = require("../models/model").Student;

const get_student = async (req, res) => {
  try {
    const students = await Student.find({ is_active: true, is_deleted: false });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create_student = async (req, res) => {
  if (!req.body.firstname) {
    return res.status(400).json({ message: "Firstname is Required." });
  }

  if (!req.body.lastname) {
    return res.status(400).json({ message: "Lastname is Required." });
  }

  if (!req.body.email) {
    return res.status(400).json({ message: "Email is Required." });
  }

  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;

  const uid = crypto.randomBytes(16).toString("hex");
  const studentData = {
    uid: uid,
    firstname: firstname,
    lastname: lastname,
    email: email
  };
  try {
    const student = new Student(studentData);
    await student.save();
    res.status(201).json({ message: "Student Created Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const edit_student = async (req, res) => {
  try {
    const studentUid = req.params.uid;

    if (!studentUid) {
      return res.status(400).json({ message: "Student UID is required" });
    }
    if (!req.body.firstname) {
      return res.status(400).json({ message: "Firstname is Required." });
    }

    if (!req.body.lastname) {
      return res.status(400).json({ message: "Lastname is Required." });
    }

    if (!req.body.email) {
      return res.status(400).json({ message: "Email is Required." });
    }

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const updatedData = {
      firstname: firstname,
      lastname: lastname,
      email: email
    };
    const student = await Student.findOneAndUpdate({ uid: studentUid }, updatedData, { new: true });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student Updated Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const delete_student = async (req, res) => {
  try {
    const studentUid = req.params.uid;
    if (!studentUid) {
      return res.status(400).json({ message: "Student UID is required" });
    }
    const student = await Student.findOneAndUpdate({ uid: studentUid }, { is_deleted: true }, { new: true });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  get_student: get_student,
  create_student: create_student,
  edit_student: edit_student,
  delete_student: delete_student
};