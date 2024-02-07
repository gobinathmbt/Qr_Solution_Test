const crypto = require('crypto');
const Course = require("../models/model").Course;

const get_course = async (req, res) => {
  try {
    const courses = await Course.find({ is_active: true, is_deleted: false });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const get_courseby_id = async (req, res) => {
  try {
    const { uid } = req.params;
    const course = await Course.findOne({ uid, is_active: true, is_deleted: false });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ courseName: course.title });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const create_course = async (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ message: "Title is Required." });
  }

  if (!req.body.description) {
    return res.status(400).json({ message: "Description is Required." });
  }

  if (!req.body.duration) {
    return res.status(400).json({ message: "Duration is Required." });
  }

  const title = req.body.title;
  const description = req.body.description;
  const duration = req.body.duration;

  const uid = crypto.randomBytes(16).toString("hex");
  const courseData = {
    uid: uid,
    title: title,
    description: description,
    duration: duration
  };
  try {
    const course = new Course(courseData);
    await course.save();
    res.status(201).json({ message: "Course Created Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const edit_course = async (req, res) => {
  try {
    const courseUid = req.params.uid;
    if (!courseUid) {
      return res.status(400).json({ message: "Course UID is required" });
    }
    if (!req.body.title) {
      return res.status(400).json({ message: "Title is Required." });
    }

    if (!req.body.description) {
      return res.status(400).json({ message: "Description is Required." });
    }

    if (!req.body.duration) {
      return res.status(400).json({ message: "Duration is Required." });
    }

    const title = req.body.title;
    const description = req.body.description;
    const duration = req.body.duration;
    const updatedData = {
      title: title,
      description: description,
      duration: duration
    };
    const course = await Course.findOneAndUpdate({ uid: courseUid }, updatedData, { new: true });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course Updated Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const delete_course = async (req, res) => {
  try {
    const courseUid = req.params.uid;
    if (!courseUid) {
      return res.status(400).json({ message: "Course UID is required" });
    }
    const course = await Course.findOneAndUpdate({ uid: courseUid }, { is_deleted: true }, { new: true });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course Deleted Successfully"});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  get_course: get_course,
  get_courseby_id: get_courseby_id,
  create_course: create_course,
  edit_course: edit_course,
  delete_course: delete_course
};