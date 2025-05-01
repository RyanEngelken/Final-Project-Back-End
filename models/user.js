const db = require('../db');

const User = db.model("User", {
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' }
});

module.exports = User;
