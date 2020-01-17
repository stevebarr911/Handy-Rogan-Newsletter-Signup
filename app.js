//Basic Project Setup

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");


const app = express();

// Allows static files like css and images to be loaded on server
app.use(express.static("public"));

// Use Body Parser
app.use(bodyParser.urlencoded({extended: true}));

// Run app on local server
app.get("/", function(req, res) {
	res.sendFile(__dirname + "/signup.html");
});


// Send infomration to the server
app.post("/" , function(req, res){
	var firstName = req.body.fName;
	var lastName = req.body.lName;
	var email = req.body.email;
	var data = {
			members: [
				{
					email_address: email,
					status: "subscribed",
					merge_fields: {
						FNAME:firstName,
						LNAME:lastName
					}
				}
			]
		};


	var jsonData = JSON.stringify(data);		

	var options = {
		url: "https://us4.api.mailchimp.com/3.0/lists/d04c7da647",
		method: "POST",
		headers: {
			"Authorization": "sbarr@ezlinks.com 4b0ddf1f68b0724b31eb48a753b5f4e7-us4"
		},
		body: jsonData
	};

	request(options, function(error, response, body) {
		if (error) {
			res.sendFile(__dirname + "/success.html");
		} else {
			if (response.statusCode === 200) {
				res.sendFile(__dirname + "/success.html");
			} else {
				res.sendFile(__dirname + "/failure.html");
			}
		}
	});
});

// Redirect user to signup page after clicking the "try again" button on the failure page.
app.post("/failure" , function(req, res) {
	res.redirect("/");
});


// Setting up server to receive info
app.listen(process.env.PORT || 3000, function() {
	console.log("Server is running on port 3000");
});
