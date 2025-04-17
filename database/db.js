const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const db = mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    pastjobs: [{
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        },
        jobTitle: {
            type: String,
            required: true
        },
        salary: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }]
});

const UserModel = mongoose.model('User', UserSchema);

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String,
        required: true
    }],
    applicants: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        userName: {
            type: String,
            required: true
        },
        userEmail: {
            type: String,
            required: true
        },
        userAbout: {
            type: String,
            required: true
        }
    }],
    status: {
        type: String,
        required: true
    }
}); 

const JobModel = mongoose.model('Job', JobSchema);  

module.exports = { UserModel , JobModel };

