var express = require('express')
var mysql = require('mysql')
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Allow cross-domain communication
app.use(cors())
app.options('*', cors())

// Probably don't need this production deployment
app.listen(8081, function() {
  console.log('App running on port 8081.')
})

var dbConnection = mysql.createConnection({
  host: 'aaup68o0mixgl.ca8q3xhabeql.us-west-2.rds.amazonaws.com',
  port: '3306',
  user: 'group5user',
  password: 'group5pw',
  database: 'group5db'
})

dbConnection.connect(function(error) {
  if (error) {
    console.log("Error connecting to server.")
    console.log(error)
  } else {
    console.log("Connected to server.")
  }
})

// Add a new contact
app.post('/contacts/', function (req, res) {
  var query = dbConnection.query('INSERT INTO Contacts SET ?', req.body, function (error, results, fields) {
    console.log(error)
    if (error) error = 1
    res.send(JSON.stringify({'status': 200, 'error': error, 'response': results}))
  })
})

// Check that user is in database
app.post('/users/', function (req, res) {
  var query = dbConnection.query('SELECT * FROM Users WHERE userName = "' + req.body.userName + '"AND password = "' + req.body.password + '"', function(error, results, fields) {
    console.log(error)
    if (error) error = 1
    res.send(JSON.stringify({'status': 200, 'error': error, 'response': results}))
  })
})

// Get a list of all contacts for a user
app.get('/contacts/', function (req, res) {
  var query = dbConnection.query('SELECT * FROM Contacts WHERE userID = "' + req.query.userID + '" AND firstName = "' + req.query.firstName + '" AND lastName = "' + req.query.lastName + '"', function (error, results, fields) {
    console.log(error)
    if (error) error = 1
    res.send(JSON.stringify({'status': 200, 'error': error, 'response': results}))
  })
})

// Delete Contacts entry
app.delete('/contacts/', function (req, res) {
  var query = dbConnection.query('DELETE FROM Contacts WHERE userID = "' + req.body.userID + '" AND firstName = "' + req.body.firstName + '" AND lastName = "' + req.body.lastName + '"', function (error, results, fields) {
    console.log(error)
    if (error) error = 1
    res.send(JSON.stringify({'status': 200, 'error': error, 'response': results}))
  })
})
