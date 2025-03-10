const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.static('public'));
const users = require('./database/users');  
const jobs = require('./database/jobs');

app.get('/', (req, res) => {
    res.sendFile('./public/index.html');
});

app.get('/allUsers', (req, res) => {
    res.send(users);
});

app.get('/allJobs', (req, res) => {
    res.send(jobs);
});

app.post('/addUser', (req, res) => {
    const user = req.body;
    users.push(user);
    res.json({
        message: 'User added successfully'
    });
});

app.get('/getUser/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(function(user){
        return user.id === id;
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
});

app.post('/updateUser', (req, res) => {
    const user = req.body;
    const id = parseInt(req.params.id);
    const updatedUser = users.find(function(user){
        return user.id === id;
    });
    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }
    updatedUser = user;
    res.json({
        message: 'User updated successfully'
    });
});

app.delete('/deleteUser/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(function(user){
        return user.id === id;
    });
    if (index === -1) {
        return res.status(404).json({ message: "User not found" });
    }
    users.splice(index, 1);
    res.json({
        message: 'User deleted successfully'
    });
});

app.post('/applyForJob/:id', (req, res) => {
    const jobId = parseInt(req.params.id);
    const userId = req.body.id;
    const job = jobs.find(function(job){
        return job.id === jobId;
    });
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }
    const user = users.find(function(user){
        return user.id === userId;
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    job.applicants.push(user);
    res.json({
        message: 'Job applied successfully'
    });
});

app.get('/job/applicants/:id', (req, res) => {
    const jobId = parseInt(req.params.id);
    const job = jobs.find(function(job){
        return job.id === jobId;
    });
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }
    res.json(job.applicants);
});

app.post('/job/applicants/:jobId/acceptApplication/:id', (req, res) => {
    const jobId = parseInt(req.params.jobId);
    const userId = parseInt(req.params.id);
    const job = jobs.find(function(job){
        return job.id === jobId;
    });
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }
    const user = users.find(function(user){
        return user.id === userId;
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    user.pastjobs.push(job);
    const jobIndex = jobs.findIndex(function(job){
        return job.id === jobId;
    });
    job.applicants.splice(jobIndex, 1);
    res.json({
        message: 'Job accepted successfully'
    });
});


app.post('/addJob', (req, res) => {
    const job = req.body;
    job.id = currentId++;
    jobs.push(job);
    res.json({
        message: 'Job added successfully'
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 