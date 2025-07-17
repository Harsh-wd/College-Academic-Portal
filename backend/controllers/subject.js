const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Student = require('../models/studentSchema.js');
const tryCatch = require('../utils/tryCatch.js');

const subjectCreate = tryCatch(async (req, res) => {
    const subjects = req.body.subjects.map((subject) => ({
        subName: subject.subName,
        subCode: subject.subCode,
        sessions: subject.sessions,
    }));

    const existingSubjectBySubCode = await Subject.findOne({
        'subjects.subCode': subjects[0].subCode,
        school: req.body.adminID,
    });

    if (existingSubjectBySubCode) {
        return res.status(409).json({ message: 'Sorry this subcode must be unique as it already exists' });
    }

    const newSubjects = subjects.map((subject) => ({
        ...subject,
        sclassName: req.body.sclassName,
        school: req.body.adminID,
    }));

    const result = await Subject.insertMany(newSubjects);
    res.status(201).json(result);
});

const allSubjects = tryCatch(async (req, res) => {
    let subjects = await Subject.find({ school: req.params.id })
        .populate("sclassName", "sclassName");
    if (subjects.length > 0) {
        res.status(200).json(subjects);
    } else {
        res.status(404).json({ message: "No subjects found" });
    }
});

const classSubjects = tryCatch(async (req, res) => {
    let subjects = await Subject.find({ sclassName: req.params.id });
    if (subjects.length > 0) {
        res.status(200).json(subjects);
    } else {
        res.status(404).json({ message: "No subjects found" });
    }
});

const freeSubjectList = tryCatch(async (req, res) => {
    let subjects = await Subject.find({ sclassName: req.params.id, teacher: { $exists: false } });
    if (subjects.length > 0) {
        res.status(200).json(subjects);
    } else {
        res.status(404).json({ message: "No subjects found" });
    }
});

const getSubjectDetail = tryCatch(async (req, res) => {
    let subject = await Subject.findById(req.params.id).populate("sclassName", "sclassName").populate("teacher", "name");
    if (subject) {
        res.status(200).json(subject);
    }
    else {
        res.status(404).json({ message: "No subject found" });
    }
});

const deleteSubject = tryCatch(async (req, res) => {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    await Teacher.updateOne({ teachSubject: deletedSubject._id }, { $unset: { teachSubject: "" } });
    await Student.updateMany({}, { $pull: { examResult: { subName: deletedSubject._id } } });
    await Student.updateMany({}, { $pull: { attendance: { subName: deletedSubject._id } } });
    res.status(200).json(deletedSubject);
});

const deleteSubjects = tryCatch(async (req, res) => {
    const subjectsToDelete = await Subject.find({ school: req.params.id });
    const subjectIds = subjectsToDelete.map(sub => sub._id);
    await Teacher.updateMany({ teachSubject: { $in: subjectIds } }, { $unset: { teachSubject: "" } });
    await Student.updateMany({}, { $pull: { examResult: { subName: { $in: subjectIds } } } });
    await Student.updateMany({}, { $pull: { attendance: { subName: { $in: subjectIds } } } });
    const result = await Subject.deleteMany({ school: req.params.id });
    res.status(200).json(result);
});

const deleteSubjectsByClass = tryCatch(async (req, res) => {
    const subjectsToDelete = await Subject.find({ sclassName: req.params.id });
    const subjectIds = subjectsToDelete.map(sub => sub._id);
    await Teacher.updateMany({ teachSubject: { $in: subjectIds } }, { $unset: { teachSubject: "" } });
    await Student.updateMany({}, { $pull: { examResult: { subName: { $in: subjectIds } } } });
    await Student.updateMany({}, { $pull: { attendance: { subName: { $in: subjectIds } } } });
    const result = await Subject.deleteMany({ sclassName: req.params.id });
    res.status(200).json(result);
});

module.exports = { subjectCreate, freeSubjectList, classSubjects, getSubjectDetail, deleteSubjectsByClass, deleteSubjects, deleteSubject, allSubjects };
