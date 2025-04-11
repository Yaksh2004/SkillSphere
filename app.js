const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('login', { message: '', username: '' });
});

app.post('/select-role', (req, res) => {
    const { username, password } = req.body;
  
    if (username === 'admin' && password === '1234') {
      res.render('selectRole', { username }); // ✅ This renders your dynamic EJS view
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
  

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

  app.post('/dashboard', (req, res) => {
    const { username, role } = req.body;
    res.send(`<h1>Welcome ${username}! You are logged in as a ${role}.</h1>`);
  });
  