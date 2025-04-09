let currentId = 3;
let applicants = 0;
const jobs = [
    {
        id: 1,
        title: 'Software Developer',
        salary: '20/hr',
        description: 'You will be working on developing software applications for various clients. We are looking for a candidate who is comfortable with programming languages such as JavaScript, Python, and Java. You will be required to work on a variety of projects, including web applications, mobile applications, and desktop applications. You will also be expected to work on a team and collaborate with other developers.',
        requirements: [
            'Strong programming skills',
            'Experience with web development',
            'Knowledge of JavaScript, Python, and Java',
            'Experience with React, Angular, and Vue.js',
            'Experience with Node.js and Express.js',
            'Familiarity with Git and GitHub'
        ],
        applicants: [],
        status: 'open'
    },
    {
        id: 2,
        title: 'UI/UX Designer',
        salary: '15/hr',
        description: "We are seeking a talented and creative UI/UX Designer to join our team on a freelance basis. You will be responsible for designing intuitive, user-friendly interfaces that enhance user experience and align with our brand vision. Your work will directly impact our platform's success and user satisfaction.",
        requirements: [
            'Strong design skills',
            'Experience with Figma, Adobe XD, Sketch, Photoshop, Illustrator, and InVision',
            'Familiarity with HTML, CSS, and JavaScript',
            'Experience with React, Angular, and Vue.js',
            'Experience with Node.js and Express.js',
            'Familiarity with Git and GitHub'
        ],
        applicants: [],
        status: 'open'
    }
]

module.exports = { jobs , currentId};