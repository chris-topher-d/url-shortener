const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const shortUrl = require('./models/shortUrl');

app.use(bodyParser.json());
app.use(cors());

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shortUrls');

// Access public folder
app.use(express.static(__dirname + '/public'));

// Create db entry
app.get('/new/:urlToShorten(*)', (req, res) => {
  let { urlToShorten } = req.params;
  let regExp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  let data = new shortUrl({
    originalUrl: urlToShorten,
    shortenedUrl: ''
  });

  if (regExp.test(urlToShorten) === true) {
    let short = Math.floor(Math.random()*100000).toString();
    data.shortenedUrl = short;

    data.save(err => {
      if (err) return res.sendd('Error saving to database');
    });

    return res.json(data);
  }

  // If the provided URL isn't a valid URL
  data.shortenedUrl = 'Invalid URL';
  return res.json(data);
});

// Query DB and send to the original URL
app.get('/:urlToVisit', (req, res) => {
  let shortenedUrl = req.params.urlToVisit;

  shortUrl.findOne({'shortenedUrl': shortenedUrl}, (err, data) => {
    if (err) return res.send('Error accessing the database');
    let regExp = new RegExp('^(http|https)://', 'i');
    let str = data.originalUrl;

    if (regExp.test(str)) res.redirect(301, data.originalUrl);
    else res.redirect(301, 'http://' + data.originalUrl);
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
