const Admin = require('../models/adminSchema.js');
const tryCatch = require('../utils/tryCatch.js');

const adminRegister = tryCatch(async (req, res) => {
    const { email, schoolName } = req.body;

    const existingAdminByEmail = await Admin.findOne({ email });
    if (existingAdminByEmail) {
        return res.send({ message: 'Email already exists' });
    }

    const existingSchool = await Admin.findOne({ schoolName });
    if (existingSchool) {
        return res.send({ message: 'School name already exists' });
    }

    const admin = new Admin({ ...req.body });
    let result = await admin.save();
    result.password = undefined;
    res.send(result);
});

const adminLogIn = tryCatch(async (req, res) => {
    if (req.body.email && req.body.password) {
        let admin = await Admin.findOne({ email: req.body.email });
        if (admin) {
            if (req.body.password === admin.password) {
                admin.password = undefined;
                res.send(admin);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
});

const getAdminDetail = tryCatch(async (req, res) => {
    let admin = await Admin.findById(req.params.id);
    if (admin) {
        admin.password = undefined;
        res.send(admin);
    }
    else {
        res.send({ message: "No admin found" });
    }
});

module.exports = { adminRegister, adminLogIn, getAdminDetail };
