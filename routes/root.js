var express = require('express');
var router = express.Router();
var fs = require('fs');
var ExifImage = require('exif').ExifImage;
var async = require('async');
var url = require('url');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/about', function (req, res, next) {
	res.render('about', {});
});

router.get('/profile', function (req, res, next) {
	res.render('profile', {});
});

router.get('/projects', function(req, res, next) {
	var foldr = "./public/images/projects/LQ/";

	fs.readdir( foldr, function (err, folders) {
		if (err) throw err;

		var pics = [];

		for (var i in folders) {
			var fname = folders[i];

			pics[fname] = new Array();
			pics[fname][0] = new Array(); 
			pics[fname][1] = new Array();
			pics[fname][2] = new Array();
			
			var folder = fs.readdirSync(foldr + folders[i] + "/");
			for (var j in folder) {
				if (folder[j] == "POSTED") continue;
				pics[fname][j % 3].push(folder[j]);
			}
		}

		res.render('projects', {visible: folders[0], pictures: pics, pathPrefix: "/images/projects/LQ/"});
	});


});

router.get('/commissions', function (req, res, next) {

	res.render("commissions", {});
});

var nodemailer = require('nodemailer');

router.post('/printMail', function (req, res, next) {
	if (req.body.email.length != 0)
		fs.appendFile("bin/mailing.txt", req.body.email + ", ");
	res.redirect("/prints");
	return;
});

router.post("/contactRequest", function (req, res, next) {

	var transporter = nodemailer.createTransport({
	    service: 'aol',
	    auth: {
	        user: 'austinlg28@aol.com',
	        pass: 'sniper28'
	    }
	});

	// NB! No need to recreate the transporter object. You can use
	// the same transporter object for all e-mails

	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: 'Austin <austinlg28@aol.com>', // sender address
	    to: 'austinf.lopez.gomez@gmail.com', // list of receivers
	    subject: req.body.subject, // Subject line
	    text: req.body.email + "\n\n\n" + req.body.content, // plaintext body
	    html: '<p>' + req.body.content + '</p>' // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	    } else{
	        console.log('Message sent: ' + info.response);
	    }
	});

	res.redirect('/about');
	return;

});

router.get('/projects/pic', function (req, res, next) {
	var parts = url.parse(req.url, true);
	console.log(parts.query);
	res.render('picture', parts.query);
})

router.get('/prints', function (req, res, next) {	
	res.render('prints', {});
});

module.exports = router;
