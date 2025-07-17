const Notice = require('../models/noticeSchema.js');
const tryCatch = require('../utils/tryCatch.js');

const noticeCreate = tryCatch(async (req, res) => {
    const notice = new Notice({
        ...req.body,
        school: req.body.adminID
    })
    const result = await notice.save()
    res.send(result)
});

const noticeList = tryCatch(async (req, res) => {
    let notices = await Notice.find({ school: req.params.id })
    if (notices.length > 0) {
        res.send(notices)
    } else {
        res.send({ message: "No notices found" });
    }
});

const updateNotice = tryCatch(async (req, res) => {
    const result = await Notice.findByIdAndUpdate(req.params.id,
        { $set: req.body },
        { new: true })
    res.send(result)
});

const deleteNotice = tryCatch(async (req, res) => {
    const result = await Notice.findByIdAndDelete(req.params.id)
    res.send(result)
});

const deleteNotices = tryCatch(async (req, res) => {
    const result = await Notice.deleteMany({ school: req.params.id })
    if (result.deletedCount === 0) {
        res.send({ message: "No notices found to delete" })
    } else {
        res.send(result)
    }
});

module.exports = { noticeCreate, noticeList, updateNotice, deleteNotice, deleteNotices };
