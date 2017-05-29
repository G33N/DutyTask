
var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect(
{
	host 	    : process.env.EMAIL_HOST || 'smtp.gmail.com',
	user 	    : process.env.EMAIL_USER || 'mceliz@scys.com.ar',
	password    : process.env.EMAIL_PASS || 'Scys999+',
	ssl		    : true
});

EM.dispatchResetPasswordLink = function(account, callback)
{
	EM.server.send({
		from         : process.env.EMAIL_FROM || 'Que sale? Login <do-not-reply@gmail.com>',
		to           : account.email,
		subject      : 'Password Reset',
		text         : 'something went wrong... :(',
		attachment   : EM.composeEmail(account)
	}, callback );
}

EM.composeEmail = function(o)
{
	var link = 'http://104.196.46.192:3000/reset-password?e='+o.email+'&p='+o.pass;
	var html = "<html><body>";
		html += "Hola! "+o.name+",<br><br>";
		html += "Tu usuario es <b>"+o.user+"</b><br><br>";
		html += "<a href='"+link+"'>Has click aqui para restablecer tu password</a><br><br>";
		html += "Saludos,<br>";
		html += "<a href='https://twitter.com/enlaceit'>Enlace IT</a><br><br>";
		html += "</body></html>";
	return  [{data:html, alternative:true}];
}
