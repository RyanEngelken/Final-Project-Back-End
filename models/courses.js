const db = require('../db');

const Course = db.model('Course', {
    instructor: { type: String, required: true },
    courseName: { type: String, required: true },
    courseId: { type: String, required: true, unique: true },
    courseDescription: { type: String, required: true },
    enrolled: { type: Boolean, default: false }, 
    dayOfWeek: { 
        type: String, 
        required: true
    },
    timeOfClass: { type: String, required: true },
    location: { type: String, required: true },
    owner: { type: db.Types.ObjectId, ref: 'User', required: true },
    enrolledUsers: [{ type: db.Types.ObjectId, ref: 'User' }] 
});

module.exports = Course;