const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = 3000; 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('login', { message: '', username: '' });
});

app.post('/select-role', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === '1234') {
    res.render('selectRole', { username });
  } else {
    res.render('login', {
      message: 'Invalid credentials',
      username
    });
  }
});

app.get('/select-role', (req, res) => {
  const username = 'admin';
  res.render('selectRole', { username });
});

app.post('/dashboard', (req, res) => {
  const { username, role } = req.body;
  res.send(`<h1>Welcome ${username}! You are logged in as a ${role}.</h1>`);
});

app.get('/home', (req, res) => {
  const images = [
    "https://media.istockphoto.com/id/1289411982/photo/cyber-security-web-development-and-work-in-it-concept.jpg?s=1024x1024&w=is&k=20&c=N1rb-2617cvdBJ6gWrwC-A7zzjQOYWK4xBg-A7JRD1s=",
    "https://media.istockphoto.com/id/2194165915/photo/hands-typing-on-laptop-with-programming-code-on-screen-representing-software-development.jpg?s=612x612&w=0&k=20&c=ltbqe0f6vKKioxRWtxeMZ2MKhezXV447qyzkaT9polU=",
    "https://media.istockphoto.com/id/2093184239/photo/programming-code-abstract-screen-of-software-developer-working-atmosphere-of-a-programmer-at.jpg?s=612x612&w=0&k=20&c=v6xQTU7yVif0l06IDa9r79b0UksIYx5k_5y3CYqtYrs="
  ];
  res.render("new", { images });
});

const renderJobPage = (res, title, description, responsibilities, qualifications) => {
  res.render("graphic", {
    job: { title, description, responsibilities, qualifications }
  });
};

app.get("/graphic", (req, res) => {
  renderJobPage(res, "Graphic Designer",
    [
      "Design and update responsive web pages",
      "Work closely with developers to implement designs"
    ],
    [
      "Design engaging graphics for digital and print media",
      "Collaborate with the content and marketing team"
    ],
    [
      "Proficiency in Adobe Creative Suite",
      "Strong understanding of visual hierarchy and layout"
    ]
  );
});

app.get("/mobile", (req, res) => {
  renderJobPage(res, "Mobile App Development",
    [
      "Design and update responsive web pages",
      "Work closely with developers to implement designs"
    ],
    [
      "Build and optimize mobile apps for Android/iOS",
      "Collaborate with UI/UX teams"
    ],
    [
      "Experience in Flutter or React Native",
      "Understanding of mobile architecture"
    ]
  );
});

app.get("/data", (req, res) => {
  renderJobPage(res, "Software Development",
    [
      "Design and update responsive web pages",
      "Work closely with developers to implement designs"
    ],
    [
      "Write clean, scalable code for software applications",
      "Maintain and improve existing systems"
    ],
    [
      "Proficiency in C++, Java or Python",
      "Good debugging and problem-solving skills"
    ]
  );
});

app.get("/webjob", (req, res) => {
  renderJobPage(res, "Website Designer",
    [
      "Design and update responsive web pages",
      "Work closely with developers to implement designs"
    ],
    [
      "Design and update responsive web pages",
      "Work closely with developers to implement designs"
    ],
    [
      "Proficiency in HTML, CSS, JS",
      "Experience with Figma or Adobe XD"
    ]
  );
});

app.post("/portfolio_submit", (req, res) => {
  const data = req.body;
  data["job"] = "graphic designer";
  console.table(data);
  res.redirect("/home");
});

app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
