const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  // res.send("<html> <body> <h1> Succesfully ran GET! </h1></body></html>");
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  var firstNumber = parseInt(req.body.firstNumber);
  var secondNumber = parseInt(req.body.secondNumber);
  var result = firstNumber + secondNumber;
  res.send("Sum is:" + result);
});







app.listen(3000, function() {
  console.log("Server started on Port: 3000");
});
