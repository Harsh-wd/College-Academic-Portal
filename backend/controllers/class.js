const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const tryCatch = require('../utils/tryCatch.js');

const sclassCreate = tryCatch(async (req, res) => {
    const sclass = new Sclass({
        sclassName: req.body.sclassName,
        school: req.body.adminID
    });

    const existingSclassByName = await Sclass.findOne({
        sclassName: req.body.sclassName,
        school: req.body.adminID
    });

    if (existingSclassByName) {
        res.send({ message: 'Sorry this class name already exists' });
    }
    else {
        const result = await sclass.save();
        res.send(result);
    }
});

const sclassList = tryCatch(async (req, res) => {
    let sclasses = await Sclass.find({ school: req.params.id })
    if (sclasses.length > 0) {
        res.send(sclasses)
    } else {
        res.send({ message: "No classes found" });
    }
});

const getSclassDetail = tryCatch(async (req, res) => {
    let sclass = await Sclass.findById(req.params.id);
    if (sclass) {
        sclass = await sclass.populate("school", "schoolName")
        res.send(sclass);
    }
    else {
        res.send({ message: "No class found" });
    }
});

const getSclassStudents = tryCatch(async (req, res) => {
    let students = await Student.find({ sclassName: req.params.id })
    if (students.length > 0) {
        let modifiedStudents = students.map((student) => {
            const { password, ...rest } = student._doc;
            return rest;
        });
        res.send(modifiedStudents);
    } else {
        res.send({ message: "No students found" });
    }
});

const deleteSclass = tryCatch(async (req, res) => {
    const result = await Sclass.findByIdAndDelete(req.params.id);
    res.send(result);
});

const deleteSclasses = tryCatch(async (req, res) => {
    const result = await Sclass.deleteMany({ school: req.params.id });
    if (result.deletedCount === 0) {
        return res.send({ message: "No classes found to delete" });
    }
    res.send(result);
});

module.exports = { sclassCreate, sclassList, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents };
