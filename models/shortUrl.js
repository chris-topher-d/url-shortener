// Structure of document for shortURL
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  originalUrl: String,
  shortenedUrl: String
}, {timestamp: true});

module.exports = mongoose.model('shortUrl', urlSchema);
