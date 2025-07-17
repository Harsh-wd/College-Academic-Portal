const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const tryCatch = require('../utils/tryCatch.js');

const studentRegister = tryCatch(async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const existingStudent = await Student.findOne({
        rollNum: req.body.rollNum,
        school: req.body.adminID,
        sclassName: req.body.sclassName,
    });

    if (existingStudent) {
        return res.status(409).json({ message: 'Roll Number already exists' });
    }

    const student = new Student({
        ...req.body,
        school: req.body.adminID,
        password: hashedPass
    });

    let result = await student.save();
    result.password = undefined;
    res.status(201).json(result);
});

const studentLogIn = tryCatch(async (req, res) => {
    let student = await Student.findOne({ rollNum: req.body.rollNum, name: req.body.studentName });
    if (student) {
        const validated = await bcrypt.compare(req.body.password, student.password);
        if (validated) {
            student = await student.populate("school", "schoolName");
            student = await student.populate("sclassName", "sclassName");
            student.password = undefined;
            res.status(200).json(student);
        } else {
            res.status(401).json({ message: "Invalid password" });
        }
    } else {
        res.status(404).json({ message: "Student not found" });
    }
});

const getStudents = tryCatch(async (req, res) => {
    let students = await Student.find({ school: req.params.id }).populate("sclassName", "sclassName");
    if (students.length > 0) {
        const modifiedStudents = students.map((student) => {
            const { password, ...rest } = student._doc;
            return rest;
        });
        res.status(200).json(modifiedStudents);
    } else {
        res.status(404).json({ message: "No students found" });
    }
});

const getStudentDetail = tryCatch(async (req, res) => {
    let student = await Student.findById(req.params.id)
        .populate("school", "schoolName")
        .populate("sclassName", "sclassName")
        .populate("examResult.subName", "subName")
        .populate("attendance.subName", "subName sessions");
    if (student) {
        student.password = undefined;
        res.status(200).json(student);
    }
    else {
        res.status(404).json({ message: "No student found" });
    }
});

const deleteStudent = tryCatch(async (req, res) => {
    const result = await Student.findByIdAndDelete(req.params.id);
    res.status(200).json(result);
});

const deleteStudents = tryCatch(async (req, res) => {
    const result = await Student.deleteMany({ school: req.params.id });
    if (result.deletedCount === 0) {
        return res.status(404).json({ message: "No students found to delete" });
    }
    res.status(200).json(result);
});

const deleteStudentsByClass = tryCatch(async (req, res) => {
    const result = await Student.deleteMany({ sclassName: req.params.id });
    if (result.deletedCount === 0) {
        return res.status(404).json({ message: "No students found to delete" });
    }
    res.status(200).json(result);
});

const updateStudent = tryCatch(async (req, res) => {
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    let result = await Student.findByIdAndUpdate(req.params.id,
        { $set: req.body },
        { new: true });

    result.password = undefined;
    res.status(200).json(result);
});

const updateExamResult = tryCatch(async (req, res) => {
    const { subName, marksObtained } = req.body;
    const student = await Student.findById(req.params.id);

    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }

    const existingResult = student.examResult.find(
        (result) => result.subName.toString() === subName
    );

    if (existingResult) {
        existingResult.marksObtained = marksObtained;
    } else {
        student.examResult.push({ subName, marksObtained });
    }

    const result = await student.save();
    res.status(200).json(result);
});

const studentAttendance = tryCatch(async (req, res) => {
    const { subName, status, date } = req.body;
    const student = await Student.findById(req.params.id);

    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }

    const subject = await Subject.findById(subName);
    if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
    }

    const existingAttendance = student.attendance.find(
        (a) =>
            a.date.toDateString() === new Date(date).toDateString() &&
            a.subName.toString() === subName
    );

    if (existingAttendance) {
        existingAttendance.status = status;
    } else {
        const attendedSessions = student.attendance.filter(
            (a) => a.subName.toString() === subName
        ).length;

        if (attendedSessions >= subject.sessions) {
            return res.status(400).json({ message: 'Maximum attendance limit reached' });
        }
        student.attendance.push({ date, status, subName });
    }

    const result = await student.save();
    res.status(200).json(result);
});

const clearAllStudentsAttendanceBySubject = tryCatch(async (req, res) => {
    const subName = req.params.id;
    const result = await Student.updateMany(
        { 'attendance.subName': subName },
        { $pull: { attendance: { subName } } }
    );
    res.status(200).json(result);
});

const clearAllStudentsAttendance = tryCatch(async (req, res) => {
    const schoolId = req.params.id;
    const result = await Student.updateMany(
        { school: schoolId },
        { $set: { attendance: [] } }
    );
    res.status(200).json(result);
});

const removeStudentAttendanceBySubject = tryCatch(async (req, res) => {
    const studentId = req.params.id;
    const subName = req.body.subId;
    const result = await Student.updateOne(
        { _id: studentId },
        { $pull: { attendance: { subName: subName } } }
    );
    res.status(200).json(result);
});

const removeStudentAttendance = tryCatch(async (req, res) => {
    const studentId = req.params.id;
    const result = await Student.updateOne(
        { _id: studentId },
        { $set: { attendance: [] } }
    );
    res.status(200).json(result);
});

module.exports = {
    studentRegister, studentLogIn, getStudents, getStudentDetail, deleteStudents,
    deleteStudent, updateStudent, studentAttendance, deleteStudentsByClass,
    updateExamResult, clearAllStudentsAttendanceBySubject, clearAllStudentsAttendance,
    removeStudentAttendanceBySubject, removeStudentAttendance,
};
