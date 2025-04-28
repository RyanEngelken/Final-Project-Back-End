const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://rengelken:rengelken2025@coursemanager.ftgihfe.mongodb.net/?retryWrites=true&w=majority&appName=CourseManager',
    {useNewUrlParser: true})

module.exports = mongoose