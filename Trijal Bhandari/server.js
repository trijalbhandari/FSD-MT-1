const express = require('express');
const app = express();
app.use(express.json());

let enrollments = [
    { id: 601, studentName: "Aarav Gupta", courseCode: "CS301", courseName: "Data Structures", semester: 3, attendance: 82 },
    { id: 602, studentName: "Meera Joshi", courseCode: "CS305", courseName: "Database Systems", semester: 3, attendance: 74 },
    { id: 603, studentName: "Kabir Khan", courseCode: "CS310", courseName: "Computer Networks", semester: 3, attendance: 91 }
];

const validateInput = (data) => {
    const { studentName, courseCode, courseName, semester, attendance } = data;
    if (!studentName || !courseCode || !courseName || semester === undefined || attendance === undefined) {
        return "All fields are required.";
    }
    if (!Number.isInteger(semester) || semester <= 0) {
        return "Semester must be a positive integer.";
    }
    if (typeof attendance !== 'number' || attendance < 0 || attendance > 100) {
        return "Attendance must be a numeric value between 0 and 100.";
    }
    return null; 
};
app.get('/api/enrollments/low-attendance', (req, res) => {
    const lowAttendance = enrollments.filter(e => e.attendance < 75);
    res.status(200).json(lowAttendance);
});
app.get('/api/enrollments/filter', (req, res) => {
    const semesterQuery = req.query.semester;
    if (!semesterQuery) {
        return res.status(400).json({ message: "Semester query parameter is required" });
    }
    const filtered = enrollments.filter(e => e.semester === parseInt(semesterQuery));
    res.status(200).json(filtered);
});
app.get('/api/enrollments', (req, res) => {
    res.status(200).json(enrollments);
});
app.post('/api/enrollments', (req, res) => {
    const error = validateInput(req.body);
    if (error) {
        return res.status(400).json({ message: error });
    }

    const newId = enrollments.length > 0 ? Math.max(...enrollments.map(e => e.id)) + 1 : 1;
    
    const newEnrollment = {
        id: newId,
        studentName: req.body.studentName,
        courseCode: req.body.courseCode,
        courseName: req.body.courseName,
        semester: req.body.semester,
        attendance: req.body.attendance
    };

    enrollments.push(newEnrollment);
    res.status(201).json(newEnrollment);
});
app.get('/api/enrollments/:id', (req, res) => {
    const enrollment = enrollments.find(e => e.id === parseInt(req.params.id));
    if (!enrollment) {
        return res.status(404).json({ message: "Enrollment not found" });
    }
    res.status(200).json(enrollment);
});
app.put('/api/enrollments/:id', (req, res) => {
    const enrollmentIndex = enrollments.findIndex(e => e.id === parseInt(req.params.id));
    
    if (enrollmentIndex === -1) {
        return res.status(404).json({ message: "Enrollment not found" });
    }

    const error = validateInput(req.body);
    if (error) {
        return res.status(400).json({ message: error });
    }

    enrollments[enrollmentIndex] = {
        id: parseInt(req.params.id),
        studentName: req.body.studentName,
        courseCode: req.body.courseCode,
        courseName: req.body.courseName,
        semester: req.body.semester,
        attendance: req.body.attendance
    };

    res.status(200).json(enrollments[enrollmentIndex]);
});
app.delete('/api/enrollments/:id', (req, res) => {
    const enrollmentIndex = enrollments.findIndex(e => e.id === parseInt(req.params.id));
    
    if (enrollmentIndex === -1) {
        return res.status(404).json({ message: "Enrollment not found" });
    }

    enrollments.splice(enrollmentIndex, 1);
    res.status(200).json({ message: "Enrollment deleted successfully" });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});