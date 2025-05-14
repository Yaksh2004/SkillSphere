const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// USER SCHEMA
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  about: { type: String, required: true },
  pastjobs: [
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
      jobTitle: { type: String, required: true },
      salary: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
});

const UserModel = mongoose.model('User', UserSchema);

// RECRUITER SCHEMA
const RecruiterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  company: { type: String, required: true },
  postedJobs: [
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
      title: { type: String, required: true },
      salary: { type: String, required: true },
    },
  ],
});

const RecruiterModel = mongoose.model('Recruiter', RecruiterSchema);

// JOB SCHEMA
const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  salary: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String, required: true }],
  applicants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      userName: { type: String, required: true },
      userEmail: { type: String, required: true },
      userAbout: { type: String, required: true },
    },
  ],
  status: { type: String, required: true }, 
});

const JobModel = mongoose.model('Job', JobSchema);

// EXPORT MODELS
module.exports = {
  mongoose,
  UserModel,
  RecruiterModel,
  JobModel,
};
