const crypto = require('crypto');
const StudentTraining = require("../models/model").StudentTraining;


const get_training = async (req, res) => {
    try {
      const students = await StudentTraining.find({ is_active: true, is_deleted: false });
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


const create_training = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({ message: "email is Required." });
  }

  if (!req.body.courseId) {
    return res.status(400).json({ message: "courseId ID is Required." });
  }

  const email = req.body.email;
  const course_id = req.body.courseId;
  const uid = crypto.randomBytes(16).toString("hex");
  const studentTrainingData = {
    uid: uid,
    email: email,
    course_id: course_id,
  };

  try {
    const studentTraining = new StudentTraining(studentTrainingData);
    await studentTraining.save();
    res.status(201).json({ message: "Student Training Created Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const edit_training = async (req, res) => {
    try {
      const studentUid = req.params.uid;
  
      if (!studentUid) {
        return res.status(400).json({ message: "training UID is required" });
      }
      if (!req.body.courseId) {
        return res.status(400).json({ message: "Firstname is Required." });
      }

      if (!req.body.email) {
        return res.status(400).json({ message: "Email is Required." });
      }
      const course_id = req.body.courseId;
      const email = req.body.email;
      const updatedData = {
        course_id: course_id,
        email: email
      };
      const student = await StudentTraining.findOneAndUpdate({ uid: studentUid }, updatedData, { new: true });
      if (!student) {
        return res.status(404).json({ message: "training not found" });
      }
      res.status(200).json({ message: "training Updated Successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const delete_training = async (req, res) => {
    try {
      const studentUid = req.params.uid;
      if (!studentUid) {
        return res.status(400).json({ message: "training UID is required" });
      }
      const student = await StudentTraining.findOneAndUpdate({ uid: studentUid }, { is_deleted: true }, { new: true });
      if (!student) {
        return res.status(404).json({ message: "training not found" });
      }
      res.status(200).json({ message: "training Deleted Successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

module.exports = {
  create_training: create_training,
  get_training:get_training,
  edit_training:edit_training,
  delete_training:delete_training,
  
};
