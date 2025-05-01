const express = require('express');
const Course = require('./models/courses')
var cors = require('cors')
const app = express(); 
app.use(cors())
app.use(express.json())
const router = express.Router();
const User = require('./models/user')
const bodyParser = require('body-parser')
require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET; 

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

//creating a new user
router.post('/users', async (req, res) => {
    if (!req.body.username || !req.body.password || !req.body.role) {
        return res.status(400).json({ error: "Missing username, password, or role" });
    }

    const allowedRoles = ['student', 'teacher', 'admin'];
    const role = allowedRoles.includes(req.body.role) ? req.body.role : 'student'; 

    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        role: role
    });

    try {
        await newUser.save();
        console.log(newUser);
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create user" });
    }
});

router.post('/auth', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({ error: "Missing username or password" });
        return;
    }

    let user = await User.findOne({ username: req.body.username });

    if (!user) {
        res.status(401).json({ error: "Bad Username" });
    } else {
        if (user.password !== req.body.password) {
            res.status(401).json({ error: "Bad password" });
        } else {
            const token = jwt.sign({ username: user.username, role: user.role }, secret, { expiresIn: '1h' });
            res.json({
                username: user.username,
                role: user.role,
                token: token,
                auth: 1
            });
        }
    }
});

router.get('/status', async (req, res) => {
    // Check if x-auth header exists
    if (!req.headers["x-auth"]) {
        return res.status(401).json({ error: "Missing X-Auth" });
    }

    const token = req.headers["x-auth"];
    try {
        // Decode the token using the secret
        const decoded = jwt.verify(token, secret);  // Use jwt.verify to both decode and validate the token

        // Find the user based on the username decoded from the token
        let user = await User.findOne({ username: decoded.username }, "username status");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Return the user's status
        res.json({ username: user.username, status: user.status });
    } catch (ex) {
        return res.status(401).json({ error: "Invalid JWT" });
    }
});


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