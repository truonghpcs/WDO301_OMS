const ClassModel = require('../models/Class');
const classController = {
    getClassByMentorID: async (req, res) => {
        const mentorId = req.params.id;
        try {
            const classes = await ClassModel.find({ mentor: mentorId }).populate('mentor');
            res.status(200).json({ data: classes });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
}
module.exports = classController;
