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
  firstname: Yup.string()
    .required("firstname is required")
    .max(30, "firstname must be at most 30 characters")
    .matches(/^[a-zA-Z ]*$/, "Only alphabets and spaces are allowed"),
  lastname: Yup.string()
    .required("lastname is required")
    .max(30, "lastname must be at most 30 characters")
    .matches(/^[a-zA-Z ]*$/, "Only alphabets and spaces are allowed"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const StudentTable = () => {
  const [students, setstudents] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedStudents, setselectedStudents] = useState({});

  useEffect(() => {
    fetchstudents();
  }, []);

  const fetchstudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_student`);
      setstudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleEditModalOpen = (students) => {
    setselectedStudents(students);
    setOpenEditModal(true);
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setOpenAddModal(false);
  };

  const handleDeleteConfirmationOpen = (students) => {
    setselectedStudents(students);
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

  const handleEditstudents = async (values) => {
    try {
      await axios.put(
        `${API_URL}/edit_student/${selectedStudents.uid}`,
        values
      );
      fetchstudents();
      handleEditModalClose();
    } catch (error) {
      console.error("Error editing students:", error);
    }
  };

  const handleDeletestudents = async () => {
    try {
      await axios.delete(`${API_URL}/delete_student/${selectedStudents.uid}`);
      fetchstudents();
      handleDeleteConfirmationClose();
    } catch (error) {
      console.error("Error deleting students:", error);
    }
  };

  const handleAddstudents = async (values) => {
    try {
      const durationString = `${values.email}`;
      await axios.post(`${API_URL}/create_student`, {
        firstname: values.firstname,
        lastname: values.lastname,
        email: durationString,
      });
      fetchstudents();
      handleAddModalClose();
    } catch (error) {
      console.error("Error adding students:", error);
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
              <TableCell sx={{ fontWeight: "800" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "800" }}>Firstname</TableCell>
              <TableCell sx={{ fontWeight: "800" }}>Lastname</TableCell>
              <TableCell sx={{ fontWeight: "800" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "800" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((students, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontWeight: "700" }}>{index + 1}</TableCell>
                <TableCell sx={{ fontWeight: "500" }}>
                  {students.firstname}
                </TableCell>
                <TableCell sx={{ fontWeight: "500" }}>
                  {students.lastname}
                </TableCell>
                <TableCell sx={{ fontWeight: "500" }}>
                  {students.email}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditModalOpen(students)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteConfirmationOpen(students)}
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
          <h2 style={{ marginBottom: "20px" }}>Edit students</h2>
          <Formik
            initialValues={{
              firstname: selectedStudents.firstname,
              lastname: selectedStudents.lastname,
              email: selectedStudents.email,
            }}
            validationSchema={validationSchema}
            onSubmit={handleEditstudents}
          >
            {({ errors, touched }) => (
              <Form>
                <Field
                  as={TextField}
                  label="Firstname"
                  name="firstname"
                  fullWidth
                  error={errors.firstname && touched.firstname}
                  helperText={
                    errors.firstname && touched.firstname && errors.firstname
                  }
                  style={{ marginBottom: "10px" }}
                />
                <Field
                  as={TextField}
                  label="Lastname"
                  name="lastname"
                  fullWidth
                  error={errors.lastname && touched.lastname}
                  helperText={
                    errors.lastname && touched.lastname && errors.lastname
                  }
                  style={{ marginBottom: "10px" }}
                />
                <div style={{ display: "flex", marginBottom: "10px" }}>
                  <Field
                    as={TextField}
                    label="Email"
                    name="email"
                    fullWidth
                    error={errors.email && touched.email}
                    helperText={errors.email && touched.email && errors.email}
                    style={{ marginRight: "10px" }}
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ marginRight: "10px" }}
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    onClick={handleEditModalClose}
                  >
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
        <DialogTitle>Delete students</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this students?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose}>Cancel</Button>
          <Button onClick={handleDeletestudents} color="error">
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
          <h2>Add New students</h2>
          <Formik
            initialValues={{
              firstname: "",
              lastname: "",
              email: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleAddstudents}
          >
            {({ errors, touched }) => (
              <Form>
                <Field
                  as={TextField}
                  label="Firstname"
                  name="firstname"
                  fullWidth
                  error={errors.firstname && touched.firstname}
                  helperText={
                    errors.firstname && touched.firstname && errors.firstname
                  }
                  style={{ marginBottom: "10px" }}
                />
                <Field
                  as={TextField}
                  label="Lastname"
                  name="lastname"
                  fullWidth
                  error={errors.lastname && touched.lastname}
                  helperText={
                    errors.lastname && touched.lastname && errors.lastname
                  }
                  style={{ marginBottom: "10px" }}
                />
                <div style={{ display: "flex", marginBottom: "10px" }}>
                  <Field
                    as={TextField}
                    label="Email"
                    name="email"
                    fullWidth
                    error={errors.email && touched.email}
                    helperText={errors.email && touched.email && errors.email}
                    style={{ marginRight: "10px" }}
                  />
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginRight: "10px" }}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={handleEditModalClose}
                >
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
        Add New students
      </Button>
    </Box>
  );
};

export default StudentTable;
