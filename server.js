const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const userToken = require('./middlewares/userToken');
const recruiterToken = require('./middlewares/recruiterToken');

app.use(express.json());

// Models
const UserModel = require('./database/db').UserModel;
const JobModel = require('./database/db').JobModel;
const RecruiterModel = require('./database/db').RecruiterModel;

// USER ROUTES
app.get('/allUsers', async (req, res) => {
  const users = await UserModel.find();
  res.send(users);
});

// Add a new user (signup)
app.post('/addUser', async (req, res) => {
  try {
    const user = new UserModel(req.body);
    const hash = await bcrypt.hash(user.password, saltRounds);
    user.password = hash;
    await user.save();
    res.json({
      message: "Signup successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

// Login a user
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const result = await bcrypt.compare(password, user.password);
    if (!result) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ _id: user._id, role: 'user' }, jwtSecret);

    res.json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// user profile
app.get('/profile', userToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update user profile
app.put('/profile', userToken, async (req, res) => {
  try {
    const updated = await UserModel.findByIdAndUpdate(req.user._id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated successfully', user: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete user profile
app.delete('/profile', userToken, async (req, res) => {
  try {
    const deleted = await UserModel.findByIdAndDelete(req.user._id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// RECRUITER ROUTES

// Recruiter signup
app.post('/recruiter/signup', async (req, res) => {
  try {
    const { name, email, password, company } = req.body;

    const existing = await RecruiterModel.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const recruiter = new RecruiterModel({
      name,
      email,
      password: hashedPassword,
      company,
    });

    await recruiter.save();

    res.json({ message: 'Recruiter signup successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Recruiter login
app.post('/recruiter/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const recruiter = await RecruiterModel.findOne({ email });
    if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });

    const isMatch = await bcrypt.compare(password, recruiter.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ _id: recruiter._id, role: 'recruiter' }, jwtSecret);

    res.json({
      message: 'Login successful',
      token,
      recruiter: {
        _id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        company: recruiter.company,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get recruiter profile
app.get('/recruiter/profile', recruiterToken, async (req, res) => {
  try {
    const recruiter = await RecruiterModel.findById(req.recruiter._id);
    if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });
    res.json(recruiter);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update recruiter profile
app.put('/recruiter/profile', recruiterToken, async (req, res) => {
  try {
    const updated = await RecruiterModel.findByIdAndUpdate(req.recruiter._id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Recruiter not found' });
    res.json({ message: 'Recruiter updated successfully', recruiter: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete recruiter profile
app.delete('/recruiter/profile', recruiterToken, async (req, res) => {
  try {
    const deleted = await RecruiterModel.findByIdAndDelete(req.recruiter._id);
    if (!deleted) return res.status(404).json({ message: 'Recruiter not found' });
    res.json({ message: 'Recruiter deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/recruiter/jobs', recruiterToken, async (req, res) => {
  try {
    const recruiter = await RecruiterModel.findById(req.recruiter._id);
    if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });
    res.json(recruiter.postedJobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
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

// Add a new job (only recruiter)
app.post('/addJob', recruiterToken, async (req, res) => {
  try {
    const job = new JobModel({ ...req.body, status: 'open', postedBy: req.recruiter._id });
    await job.save();
    res.json({
      message: 'Job added successfully',
      jobId: job._id,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Apply for a job (only user)
app.post('/applyForJob/:id', userToken, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user._id;

    const job = await JobModel.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.status !== 'open') {
      return res.status(400).json({ message: "Job is closed" });
    }

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    job.applicants.push({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      userAbout: user.about,
    });

    await job.save();
    res.json({ message: "Job applied successfully" });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get job applicants (recruiter only)
app.get('/job/applicants/:id', recruiterToken, async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await JobModel.findOne({_id: jobId, postedBy: req.recruiter._id});
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job.applicants);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Accept a job application (recruiter only)
app.post('/job/applicants/:jobId/acceptApplication/:userId', recruiterToken, async (req, res) => {
  try {
    const { jobId, userId } = req.params;

    const job = await JobModel.findOne({_id: jobId, postedBy: req.recruiter._id});
    if (!job) return res.status(404).json({ message: "Job not found" });

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

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
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// START SERVER
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
