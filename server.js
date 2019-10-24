const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  // res.send("<html> <body> <h1> Succesfully ran GET! </h1></body></html>");
  res.sendFile(__dirname + "/index.html");
});

app.get("/api1", function(req, res) {
  res.sendFile(__dirname + "/testapi1.html")
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// POST
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.post("/", function(req, res) {

  // console.log(req.body);
  // console.log(req.body.firstNumber);
  if (req.body.submit == "SumNumbers") {

    var firstNumber = parseInt(req.body.firstNumber);
    var secondNumber = parseInt(req.body.secondNumber);
    var result = firstNumber + secondNumber;
    res.send("Sum is:" + result);

  } else {

    // First Request --- get location details & key of the city
    //** note: requires the city name to be passed under the query string qs. qs - keyword
    var url = "http://dataservice.accuweather.com/locations/v1/cities/search";
    var options = {
      url: url,
      method: "GET",
      qs: {
        apikey: "cy4dHXTMiuXBG7Nblr0EDZH7pgBcH7Er",
        q: req.body.location
      }
    };

    var jsonData = "";
    var jsonData2 = "";


    request(options, function(error, response, body) {
      jsonData = JSON.parse(body);

      // Second Request - get weather details for key
      //** note: this requires the key to be mentioned in the URL as per the API reference Info.
      var url1 = ("http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/" + jsonData[0].Key);
      var options1 = {
        url: url1,
        method: "GET",
        qs: {
          apikey: "cy4dHXTMiuXBG7Nblr0EDZH7pgBcH7Er"
        }
      };
      request(options1, function(error, response, body) {
        jsonData2 = JSON.parse(body);

        res.write("<html>" + "<body> <ul>");
        res.write("<li>" + jsonData[0].EnglishName + "</li>");
        res.write("<li>" + jsonData[0].Region.LocalizedName + "</li>");
        res.write("<li>" + jsonData[0].AdministrativeArea.LocalizedName + "</li>");
        res.write("<li>" + jsonData[0].GeoPosition.Latitude + "," + jsonData[0].GeoPosition.Longitude + "</li>");
        res.write("<li>" + jsonData[0].TimeZone.Code + "</li>");

        // res.write("<html>" + "<body> <ul>");
        var tempFar = parseFloat(jsonData2[0].Temperature.Value);
        var tempCel = Math.round((tempFar - 32) / 1.8);
        res.write("<li>" + jsonData2[0].IconPhrase + "</li>");
        res.write("<li> Rains: " + jsonData2[0].HasPrecipitation + "</li>");
        res.write("<li>" + tempCel + "C" + "</li>");
        // jsonData2[0].Temperature.Unit
        res.write("</ul> </body> </html>");

        res.send();
      });


    });



  }

});




// cy4dHXTMiuXBG7Nblr0EDZH7pgBcH7Er
// http://dataservice.accuweather.com/locations/v1/cities/search?apiKey="cy4dHXTMiuXBG7Nblr0EDZH7pgBcH7Er"&q="Toronto"







app.listen(3000, function() {
  console.log("Server started on Port: 3000");
});
