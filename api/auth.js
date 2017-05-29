var app = require("express");
var router = app.Router();
var CT = require('./auth/country-list');
var AM = require('./auth/account-manager');
var EM = require('./auth/email-dispatcher');

// main login page //
router.get('/login', function(req, res) {
    // check if the user's credentials are saved in a cookie //
    if (req.cookies.user == undefined || req.cookies.pass == undefined) {
        res.render('login', {
            title: 'Hello - Please Login To Your Account'
        });
    } else {
        // attempt automatic login //
        AM.autoLogin(req.cookies.user, req.cookies.pass, function(o) {
            if (o != null) {
                req.session.user = o;
                res.redirect('/#/home');
            } else {
                res.render('login', {
                    title: 'Hello - Please Login To Your Account'
                });
            }
        });
    }
});

// Search user by login
router.post('/login', function(req, res) {
    var origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', origin);
    AM.manualLogin(req.body.email, req.body.password, function(e, o) {
        if (!o) {
            res.status(400).send(e);
        } else {
            req.session.user = o;
            if (req.body.rememberme == 'true') {
                res.cookie('email', o.email, {
                    maxAge: 900000
                });
                res.cookie('password', o.password, {
                    maxAge: 900000
                });
            }
            res.status(200).send(o);
        }
    });
});

// creating new accounts //

	router.get('/signup', function(req, res) {
		//res.render('signup', {  title: 'Signup', countries : CT });
	});

	router.post('/signup', function(req, res){
		var origin = req.headers.origin;
		res.setHeader('Access-Control-Allow-Origin', origin);
		AM.addNewAccount({
			firstName 	: req.body.firstName,
			lastName 	: req.body.lastName,
			email 	: req.body.email,
			user	: req.body.user,
			password : req.body.password
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});

module.exports = router;
