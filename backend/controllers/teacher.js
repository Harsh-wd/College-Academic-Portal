const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');
const tryCatch = require('../utils/tryCatch.js');

const teacherRegister = tryCatch(async (req, res) => {
    const { name, email, password, role, school, teachSubject, teachSclass } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const teacher = new Teacher({ name, email, password: hashedPass, role, school, teachSubject, teachSclass });
    const existingTeacherByEmail = await Teacher.findOne({ email });

    if (existingTeacherByEmail) {
        return res.status(409).json({ message: 'Email already exists' });
    }

    let result = await teacher.save();
    await Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id });
    result.password = undefined;
    res.status(201).json(result);
});

const teacherLogIn = tryCatch(async (req, res) => {
    let teacher = await Teacher.findOne({ email: req.body.email });
    if (teacher) {
        const validated = await bcrypt.compare(req.body.password, teacher.password);
        if (validated) {
            teacher = await teacher.populate("teachSubject", "subName sessions");
            teacher = await teacher.populate("school", "schoolName");
            teacher = await teacher.populate("teachSclass", "sclassName");
            teacher.password = undefined;
            res.status(200).json(teacher);
        } else {
            res.status(401).json({ message: "Invalid password" });
        }
    } else {
        res.status(404).json({ message: "Teacher not found" });
    }
});

const getTeachers = tryCatch(async (req, res) => {
    let teachers = await Teacher.find({ school: req.params.id })
        .populate("teachSubject", "subName")
        .populate("teachSclass", "sclassName");
    if (teachers.length > 0) {
        const modifiedTeachers = teachers.map((teacher) => {
            const { password, ...rest } = teacher._doc;
            return rest;
        });
        res.status(200).json(modifiedTeachers);
    } else {
        res.status(404).json({ message: "No teachers found" });
    }
});

const getTeacherDetail = tryCatch(async (req, res) => {
    let teacher = await Teacher.findById(req.params.id)
        .populate("teachSubject", "subName sessions")
        .populate("school", "schoolName")
        .populate("teachSclass", "sclassName");
    if (teacher) {
        teacher.password = undefined;
        res.status(200).json(teacher);
    }
    else {
        res.status(404).json({ message: "No teacher found" });
    }
});

const updateTeacherSubject = tryCatch(async (req, res) => {
    const { teacherId, teachSubject } = req.body;
    const updatedTeacher = await Teacher.findByIdAndUpdate(
        teacherId,
        { teachSubject },
        { new: true }
    );
    await Subject.findByIdAndUpdate(teachSubject, { teacher: updatedTeacher._id });
    res.status(200).json(updatedTeacher);
});

const deleteTeacher = tryCatch(async (req, res) => {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    await Subject.updateOne({ teacher: deletedTeacher._id }, { $unset: { teacher: "" } });
    res.status(200).json(deletedTeacher);
});

const deleteTeachers = tryCatch(async (req, res) => {
    const teachersToDelete = await Teacher.find({ school: req.params.id });
    const teacherIds = teachersToDelete.map(t => t._id);
    await Subject.updateMany({ teacher: { $in: teacherIds } }, { $unset: { teacher: "" } });
    const result = await Teacher.deleteMany({ school: req.params.id });
    res.status(200).json(result);
});

const deleteTeachersByClass = tryCatch(async (req, res) => {
    const teachersToDelete = await Teacher.find({ teachSclass: req.params.id });
    const teacherIds = teachersToDelete.map(t => t._id);
    await Subject.updateMany({ teacher: { $in: teacherIds } }, { $unset: { teacher: "" } });
    const result = await Teacher.deleteMany({ teachSclass: req.params.id });
    res.status(200).json(result);
});

const teacherAttendance = tryCatch(async (req, res) => {
    const { status, date } = req.body;
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
    }

    const existingAttendance = teacher.attendance.find(
        (a) => a.date.toDateString() === new Date(date).toDateString()
    );

    if (existingAttendance) {
        existingAttendance.status = status;
    } else {
        teacher.attendance.push({ date, status });
    }

    const result = await teacher.save();
    res.status(200).json(result);
});

module.exports = {
    teacherRegister, teacherLogIn, getTeachers, getTeacherDetail, updateTeacherSubject,
    deleteTeacher, deleteTeachers, deleteTeachersByClass, teacherAttendance
};
