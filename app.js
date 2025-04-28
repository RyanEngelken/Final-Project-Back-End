const express = require('express');
const Course = require('./models/courses')
var cors = require('cors')
const app = express(); 
app.use(cors())
app.use(express.json())
const router = express.Router();

//gets all courses
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
        console.log(courses);
    } catch (err) {
        console.error(err);
    }
})

//creates a course
router.post('/courses', async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json(course);
        console.log(course);
    } catch (err) {
        console.error(err);
    }
})

//gets a course by id
router.get('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).send('Course not found');
        }
        res.json(course);
    } catch (err) {
        res.status(400).send(err);;
    }
})

//updates a course
router.put('/courses/:id', async (req, res) => {
    try {
        const course = req.body;
        await Course.updateOne({ _id: req.params.id }, course);
        res.sendStatus(204);
    } catch (err) {
        res.status(400).send(err);;
    }
})

//deletes a course
router.delete('/courses/:id', async (req, res) => {
    try {
        await Course.deleteOne({ _id: req.params.id });
        res.sendStatus(204);
    } catch (err) {
        res.status(400).send(err);
    }
})


app.use("/api", router);
app.listen(3000);