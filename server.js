const express = require('express');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());

// Models
const UserModel = require('./models/User');
const JobModel = require('./models/Job');

// USER ROUTES

// Get all users
app.get('/allUsers', async (req, res) => {
  const users = await UserModel.find();
  res.send(users);
});

// Add a new user
app.post('/addUser', async (req, res) => {
  const user = new UserModel(req.body);
  bcrypt.hash(user.password, saltRounds, async function (err, hash) {
    if (err) {
      return res.status(500).json({ message: 'Error generating hash' });
    }
    user.password = hash;
    await user.save();
    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  });
});

// Login a user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.json({ message: "User not found" });
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) return res.json({ message: "Error comparing passwords" });

    if (!result) {
      return res.json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  });
});


// Get a user by ID
app.get('/getUser/:id', async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// Update user by ID
app.put('/updateUser/:id', async (req, res) => {
  const updated = await UserModel.findByIdAndUpdate(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ message: 'User updated successfully' });
});

// Delete a user by ID
app.delete('/deleteUser/:id', async (req, res) => {
  const deleted = await UserModel.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ message: 'User deleted successfully' });
});

// JOB ROUTES

// Get all jobs
app.get('/allJobs', async (req, res) => {
  const jobs = await JobModel.find();
  res.send(jobs);
});

// Get available jobs
app.get('/availableJobs', async (req, res) => {
  const availableJobs = await JobModel.find({ status: 'open' });
  res.send(availableJobs);
});

// Add a new job
app.post('/addJob', async (req, res) => {
  const job = new JobModel({ ...req.body, status: 'open' });
  await job.save();
  res.json({
    message: 'Job added successfully',
    jobId: job._id,
  });
});

// Apply for a job
app.post('/applyForJob/:id', async (req, res) => {
  const jobId = req.params.id;
  const userId = req.body.id;

  const job = await JobModel.findById(jobId);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  if (job.status !== 'open') {
    return res.status(400).json({ message: "Job is closed" });
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  job.applicants.push({
    userId: user._id,
    userName: user.name,
    userEmail: user.email,
    userAbout: user.about,
  });

  await job.save();
  res.json({ message: "Job applied successfully" });
});

// Get job applicants
app.get('/job/applicants/:id', async (req, res) => {
  const jobId = req.params.id;

  const job = await JobModel.findById(jobId);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  res.json(job.applicants);
});

// Accept a job application
app.post('/job/applicants/:jobId/acceptApplication/:userId', async (req, res) => {
  const { jobId, userId } = req.params;

  const job = await JobModel.findById(jobId);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.pastjobs.push({
    jobId: job._id,
    jobTitle: job.title,
    salary: job.salary,
    description: job.description,
  });

  job.status = 'closed';

  await user.save();
  await job.save();

  res.json({ message: "Job accepted and added to user's past jobs" });
});

// START SERVER
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
