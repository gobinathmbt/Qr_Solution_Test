import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = "http://localhost:8083";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .max(30, "Title must be at most 30 characters")
    .matches(/^[a-zA-Z ]*$/, "Only alphabets and spaces are allowed"),
  description: Yup.string()
    .required("Description is required")
    .max(50, "Description must be at most 50 characters")
    .matches(/^[a-zA-Z ]*$/, "Only alphabets and spaces are allowed"),
  duration: Yup.number()
    .required("Duration is required")
    .positive("Duration must be a positive number")
    .max(30, "Duration must be at most 30"),
});

const CourseTable = () => {
  const [courses, setCourses] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState({});


  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_course`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleEditModalOpen = (course) => {
    setSelectedCourse(course);
    setOpenEditModal(true);
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setOpenAddModal(false);
  };

  const handleDeleteConfirmationOpen = (course) => {
    setSelectedCourse(course);
    setOpenDeleteConfirmation(true);
  };

  const handleDeleteConfirmationClose = () => {
    setOpenDeleteConfirmation(false);
  };

  const handleAddModalOpen = () => {
    setOpenAddModal(true);
  };

  const handleAddModalClose = () => {
    setOpenAddModal(false);
  };

  const handleEditCourse = async (values) => {
    try {
      await axios.put(`${API_URL}/edit_course/${selectedCourse.uid}`, values);
      fetchCourses();
      handleEditModalClose();
    } catch (error) {
      console.error("Error editing course:", error);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await axios.delete(`${API_URL}/delete_course/${selectedCourse.uid}`);
      fetchCourses();
      handleDeleteConfirmationClose();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleAddCourse = async (values) => {
    try {
      const durationString = `${values.duration} ${values.durationUnit}`;
      await axios.post(`${API_URL}/create_course`, {
        title: values.title,
        description: values.description,
        duration: durationString,
      });
      fetchCourses();
      handleAddModalClose();
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        padding: "20px",
      }}
    >
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight:"800"}}>ID</TableCell>
              <TableCell sx={{fontWeight:"800"}}>Title</TableCell>
              <TableCell sx={{fontWeight:"800"}}>Description</TableCell>
              <TableCell sx={{fontWeight:"800"}}>Duration</TableCell>
              <TableCell sx={{fontWeight:"800"}}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course, index) => (
              <TableRow key={index}>
                <TableCell sx={{fontWeight:"700"}}>{index + 1}</TableCell>
                <TableCell sx={{fontWeight:"500"}}>{course.title}</TableCell>
                <TableCell sx={{fontWeight:"500"}}>{course.description}</TableCell>
                <TableCell sx={{fontWeight:"500"}}>{course.duration}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditModalOpen(course)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteConfirmationOpen(course)}
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Edit Course</h2>
          <Formik
  initialValues={{
    title: selectedCourse.title,
    description: selectedCourse.description,
    duration: selectedCourse.duration,
    durationUnit: selectedCourse.durationUnit,
  }}
  validationSchema={validationSchema}
  onSubmit={handleEditCourse}
>
  {({ errors, touched }) => (
    <Form>
      <Field
        as={TextField}
        label="Title"
        name="title"
        fullWidth
        error={errors.title && touched.title}
        helperText={errors.title && touched.title && errors.title}
        style={{ marginBottom: "10px" }}
      />
      <Field
        as={TextField}
        label="Description"
        name="description"
        fullWidth
        error={errors.description && touched.description}
        helperText={
          errors.description &&
          touched.description &&
          errors.description
        }
        style={{ marginBottom: "10px" }}
      />
      <div style={{ display: "flex", marginBottom: "10px" }}>
        <Field
          as={TextField}
          label="Duration"
          name="duration"
          fullWidth
          error={errors.duration && touched.duration}
          helperText={errors.duration && touched.duration && errors.duration}
          style={{ marginRight: "10px" }}
        />
        <Field
          as={FormControl}
          fullWidth
          error={errors.durationUnit && touched.durationUnit}
          style={{ minWidth: "120px" }}
        >
          <InputLabel id="duration-unit-label">Unit</InputLabel>
          <Field
            as={Select}
            labelId="duration-unit-label"
            id="duration-unit"
            name="durationUnit"
          >
            <MenuItem value="days">Days</MenuItem>
            <MenuItem value="months">Months</MenuItem>
            <MenuItem value="years">Years</MenuItem>
          </Field>
          {errors.durationUnit && touched.durationUnit && (
            <div>{errors.durationUnit}</div>
          )}
        </Field>
      </div>
      <div>
        <Button type="submit" variant="contained" color="primary" style={{ marginRight: "10px" }}>
          Save
        </Button>
        <Button type="button" variant="contained" color="secondary" onClick={handleEditModalClose}>
          Cancel
        </Button>
      </div>
    </Form>
  )}
</Formik>

        </Box>
      </Modal>

      <Dialog
        open={openDeleteConfirmation}
        onClose={handleDeleteConfirmationClose}
      >
        <DialogTitle>Delete Course</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this course?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose}>Cancel</Button>
          <Button onClick={handleDeleteCourse} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={openAddModal} onClose={handleAddModalClose}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h2>Add New Course</h2>
          <Formik
  initialValues={{
    title: "",
    description: "",
    duration: "",
    durationUnit: "days",
  }}
  validationSchema={validationSchema}
  onSubmit={handleAddCourse}
>
  {({ errors, touched }) => (
    <Form>
      <Field
        as={TextField}
        label="Title"
        name="title"
        fullWidth
        error={errors.title && touched.title}
        helperText={errors.title && touched.title && errors.title}
        style={{ marginBottom: "10px" }}
      />
      <Field
        as={TextField}
        label="Description"
        name="description"
        fullWidth
        error={errors.description && touched.description}
        helperText={
          errors.description &&
          touched.description &&
          errors.description
        }
        style={{ marginBottom: "10px" }}
      />
      <div style={{ display: "flex", marginBottom: "10px" }}>
        <Field
          as={TextField}
          label="Duration"
          name="duration"
          fullWidth
          error={errors.duration && touched.duration}
          helperText={errors.duration && touched.duration && errors.duration}
          style={{ marginRight: "10px" }}
        />
        <Field
          as={FormControl}
          fullWidth
          error={errors.durationUnit && touched.durationUnit}
          style={{ minWidth: "120px" }}
        >
          <InputLabel id="duration-unit-label">Unit</InputLabel>
          <Field
            as={Select}
            labelId="duration-unit-label"
            id="duration-unit"
            name="durationUnit"
          >
            <MenuItem value="days">Days</MenuItem>
            <MenuItem value="months">Months</MenuItem>
            <MenuItem value="years">Years</MenuItem>
          </Field>
          {errors.durationUnit && touched.durationUnit && (
            <div>{errors.durationUnit}</div>
          )}
        </Field>
      </div>
      <Button type="submit" variant="contained" color="primary" style={{ marginRight: "10px" }}>
          Add
        </Button>
        <Button type="button" variant="contained" color="secondary" onClick={handleEditModalClose}>
          Cancel
        </Button>
    </Form>
  )}
</Formik>

        </Box>
      </Modal>

      <Button
        variant="contained"
        onClick={handleAddModalOpen}
        sx={{ marginTop: "20px" }}
      >
        Add New Course
      </Button>
    </Box>
  );
};

export default CourseTable;
