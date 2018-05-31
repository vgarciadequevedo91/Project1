var express = require('express')
var mysql = require('mysql')
var bodyParser = require('body-parser')
var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Probably don't need this for
app.listen(8081, function() {
  console.log('App running on port 8081.')
})

// Dev connection, comment out for production deployment
var dbConnection = mysql.createConnection({
  host: 'aaup68o0mixgl.ca8q3xhabeql.us-west-2.rds.amazonaws.com',
  port: '3306',
  user: 'group5user',
  password: 'group5pw',
  database: 'group5db'
})

// Production connection, comment out for local testing
var dbConnection = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT
})

// TODO: Finish officially connecting to database
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
  var query = dbConnection.query('INSERT INTO Contacts SET ?', req.query, function (error, results, fields) {
    if (error) error = 1
    res.send(JSON.stringify({'status': 200, 'error': error, 'response': results}))
  })
})

// Get a list of all contacts for a user
app.get('/contacts/', function (req, res) {
  var query = dbConnection.query('SELECT * FROM Contacts WHERE userID = "' + req.query.userID + '"', function (error, results, fields) {
    if (error) error = 1
    res.send(JSON.stringify({'status': 200, 'error': error, 'response': results}))
  })
})

// Delete Contacts entry
app.delete('/contacts/', function (req, res) {
  var query = dbConnection.query('DELETE FROM Contacts WHERE firstName = "' + req.query.firstName + '" AND lastName = "' + req.query.lastName + '"', function (error, results, fields) {
    if (error) error = 1
    res.send(JSON.stringify({'status': 200, 'error': error, 'response': results}))
  })
})
