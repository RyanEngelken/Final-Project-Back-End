const db = require('../db');

const Course = db.model('Course', {
    instructor: {type: String, required: true},
    courseName: {type: String, required: true},
    courseId: {type: String, required: true},
    courseDescription: {type: String, required: true},
    enrolled: Boolean,
    dayOfWeek: {type: String, required: true},
    timeOfClass: {type: String, required: true},
    location: {type: String, required: true},
})

module.exports = Course;