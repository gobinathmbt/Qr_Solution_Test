import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  IconButton,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Box,
  InputLabel, // Import InputLabel
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = "http://localhost:8083";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  courseId: Yup.string().required("Course is required"),
//   email: Yup.string().email("Invalid email").required("Email is required"),
});

const StudentTrainingTable = () => {
  const [schedules, setSchedules] = useState([]);
  const [newschedules, setnewSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState({});
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [students, setstudents] = useState([]);

  useEffect(() => {
    fetchSchedules();
    fetchCourses();
    fetchstudents();
  }, []);

  useEffect(() => {
    if (schedules.length > 0) {
      fetchCourseNames();
    }
  }, [schedules]);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_training`);
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const fetchCourseNames = async () => {
    const updatedSchedules = [];
    for (const schedule of schedules) {
      try {
        const uid = schedule.course_id;
        const response = await axios.get(`${API_URL}/get_course/${uid}`);
        const courseName = response.data.courseName;
        const updatedSchedule = { ...schedule, courseName };
        updatedSchedules.push(updatedSchedule);
      } catch (error) {
        console.error("Error fetching course name:", error);
      }
    }
    setnewSchedules(updatedSchedules);
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_course`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchstudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_student`);
      setstudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleEditModalOpen = (schedule) => {
    setSelectedSchedule(schedule);
    setOpenEditModal(true);
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setSelectedSchedule({});
  };

  const handleDeleteConfirmationOpen = (schedule) => {
    setSelectedSchedule(schedule);
    setOpenDeleteConfirmation(true);
  };


  const handleAddModalOpen = () => {
    setOpenAddModal(true);
  };

  const handleAddModalClose = () => {
    setOpenAddModal(false);
  };

  const handleDeleteConfirmationClose = () => {
    fetchSchedules();
    setOpenDeleteConfirmation(false);
  };


  const handleEditSchedule = async (values) => {
    try {
      await axios.put(
        `${API_URL}/edit_training/${selectedSchedule.uid}`,
        values
      );
      fetchSchedules();
      handleEditModalClose();
    } catch (error) {
      console.error("Error editing schedule:", error);
    }
  };

  const handleAddSchedule = async (values) => {
    try {
      await axios.post(`${API_URL}/create_training`, values);
      fetchSchedules();
      handleAddModalClose();
    } catch (error) {
      console.error("Error adding schedule:", error);
    }
  };

  const handleDeleteSchedule = async () => {
    try {
      await axios.delete(`${API_URL}/delete_training/${selectedSchedule.uid}`);
      fetchSchedules();
      handleDeleteConfirmationClose();
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell sx={{fontWeight:"800"}}>ID</TableCell>
              <TableCell sx={{fontWeight:"800"}}>Course</TableCell>
              <TableCell sx={{fontWeight:"800"}}>Canditate Email</TableCell>
              <TableCell sx={{fontWeight:"800"}}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newschedules.map((schedule,index) => (
              <TableRow key={index}>
                 <TableCell sx={{fontWeight:"700"}}>{index + 1}</TableCell>
                <TableCell sx={{fontWeight:"500"}}>{schedule.courseName}</TableCell>
                <TableCell sx={{fontWeight:"500"}}>{schedule.email}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditModalOpen(schedule)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteConfirmationOpen(schedule)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openEditModal} onClose={handleEditModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            boxShadow: 24,
            p: 4,
            width: 400,
          }}
        >
          <h2>Edit Schedule</h2>
          <Formik
            initialValues={{
              courseId: selectedSchedule.course_id || "",
              email: selectedSchedule.email || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleEditSchedule}
          >
            {({ errors, touched }) => (
              <Form>
                <Box mb={2}>
                  <InputLabel htmlFor="courseId">Course</InputLabel>
                  <Field
                    as={Select}
                    name="courseId"
                    fullWidth
                    error={errors.courseId && touched.courseId}
                  >
                    {courses.map((course) => (
                      <MenuItem key={course._id} value={course.uid}>
                        {course.title}
                      </MenuItem>
                    ))}
                  </Field>
                  {errors.courseId && touched.courseId && (
                    <div style={{ color: "red" }}>{errors.courseId}</div>
                  )}
                </Box>
                <Box mb={2}>
                  <InputLabel htmlFor="email"> Student Email</InputLabel>
                  <Field
                    as={Select}
                    name="email"
                    fullWidth
                    error={errors.email && touched.email}
                  >
                    {students.map((students) => (
                      <MenuItem key={students._id} value={students.email}>
                        {students.email}
                      </MenuItem>
                    ))}
                  </Field>
                  {errors.email && touched.email && (
                    <div style={{ color: "red" }}>{errors.email}</div>
                  )}
                </Box>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      <Dialog
        open={openDeleteConfirmation}
        onClose={handleDeleteConfirmationClose}
      >
        <DialogTitle>Delete students</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this students?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose}>Cancel</Button>
          <Button onClick={handleDeleteSchedule} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginTop:"10px"}}>
        <Button variant="contained" onClick={handleAddModalOpen}>
          Add New Training
        </Button>
      </div>

      <Modal open={openAddModal} onClose={handleAddModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            boxShadow: 24,
            p: 4,
            width: 400,
          }}
        >
          <h2>Add New Training</h2>
          <Formik
            initialValues={{
              courseId: "",
              email: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleAddSchedule}
          >
            {({ errors, touched }) => (
              <Form>
                <Box mb={2}>
                  <InputLabel htmlFor="courseId">Course</InputLabel>
                  <Field
                    as={Select}
                    name="courseId"
                    fullWidth
                    error={errors.courseId && touched.courseId}
                  >
                    {courses.map((course) => (
                      <MenuItem key={course._id} value={course.uid}>
                        {course.title}
                      </MenuItem>
                    ))}
                  </Field>
                  {errors.courseId && touched.courseId && (
                    <div style={{ color: "red" }}>{errors.courseId}</div>
                  )}
                </Box>
                <Box mb={2}>
                  <InputLabel htmlFor="email"> Student Email</InputLabel>
                  <Field
                    as={Select}
                    name="email"
                    fullWidth
                    error={errors.email && touched.email}
                  >
                    {students.map((students) => (
                      <MenuItem key={students._id} value={students.email}>
                        {students.email}
                      </MenuItem>
                    ))}
                  </Field>
                  {errors.email && touched.email && (
                    <div style={{ color: "red" }}>{errors.email}</div>
                  )}
                </Box>
               
               
                <Button type="submit" variant="contained" color="primary">
                  Add
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
  );
};

export default StudentTrainingTable;
