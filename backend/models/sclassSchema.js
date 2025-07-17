const mongoose = require("mongoose");
const Student = require('./studentSchema');
const Subject = require('./subjectSchema');
const Teacher = require('./teacherSchema');

const sclassSchema = new mongoose.Schema({
    sclassName: {
        type: String,
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
}, { timestamps: true });

// Middleware to handle cascading deletes for related documents
sclassSchema.pre('deleteMany', async function (next) {
    try {
        const classesToDelete = await this.model.find(this.getFilter());
        const classIds = classesToDelete.map(c => c._id);

        if (classIds.length > 0) {
            await Student.deleteMany({ sclassName: { $in: classIds } });
            await Subject.deleteMany({ sclassName: { $in: classIds } });
            await Teacher.deleteMany({ teachSclass: { $in: classIds } });
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("sclass", sclassSchema);
