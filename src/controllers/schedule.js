const Schedule = require("../models/model").Schedule;
const crypto = require('crypto');


const get_schedule = async (req, res) => {
    try {
      const schedule = await Schedule.find({ is_active: true, is_deleted: false });
      res.status(200).json(schedule);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const create_schedule = async (req, res) => {
    if (!req.body.courseId) {
        return res.status(400).json({ message: "courseId is Required." });
    }

    if (!req.body.startDate) {
        return res.status(400).json({ message: "startDate is Required." });
    }

    if (!req.body.endDate) {
        return res.status(400).json({ message: "endDate is Required." });
    }
    if (!req.body.instructor) {
        return res.status(400).json({ message: "instructor is Required." });
    }
    
    const courseId = req.body.courseId;
    const start_date = req.body.startDate;
    const end_date = req.body.endDate;
    const instructor = req.body.instructor;

    const uid = crypto.randomBytes(16).toString("hex");
    const scheduleData = {
      uid: uid,
      course_id: courseId,
      start_date: start_date,
      end_date: end_date,
      instructor: instructor
    };
    try {
    const schedule = new Schedule(scheduleData);
    await schedule.save();
    res.status(201).json({ message: "Schedule Created Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



const edit_schedule = async (req, res) => {

  try {
    const scheduleUid = req.params.uid;
    if (!scheduleUid) {
      return res.status(400).json({ message: "Schedule UID is required" });
    }
    if (!req.body.courseId) {
      return res.status(400).json({ message: "courseId is Required." });
  }

  if (!req.body.startDate) {
      return res.status(400).json({ message: "startDate is Required." });
  }

  if (!req.body.endDate) {
      return res.status(400).json({ message: "endDate is Required." });
  }
  if (!req.body.instructor) {
      return res.status(400).json({ message: "instructor is Required." });
  }
  
  const courseId = req.body.courseId;
  const start_date = req.body.startDate;
  const end_date = req.body.endDate;
  const instructor = req.body.instructor;
    const updatedData = {
      course_id: courseId,
      start_date: start_date,
      end_date: end_date,
      instructor: instructor
    };
    const schedule = await Schedule.findOneAndUpdate({ uid: scheduleUid }, updatedData, { new: true });
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(200).json({ message: "Schedule Updated Successfully"});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const delete_schedule = async (req, res) => {
  try {
    const scheduleUid = req.params.uid;
    if (!scheduleUid) {
      return res.status(400).json({ message: "Schedule UID is required" });
    }
    const schedule = await Schedule.findOneAndUpdate({ uid: scheduleUid }, { is_deleted: true }, { new: true });
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(200).json({ message: "Schedule Deleted Successfully", schedule: schedule });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = {
    create_schedule: create_schedule,
    get_schedule:get_schedule,
    edit_schedule:edit_schedule,
    delete_schedule:delete_schedule,
  };