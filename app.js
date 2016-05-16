var schedule = require('node-schedule');
var inbox = require("inbox");
var client = inbox.createConnection(993, "imap.hibox.biz", {
	secureConnection: true,
	auth : {
		user : "cht33@hb33.hibox.biz",
		pass: "Abc123456"
	}
});
var count = 0;

client.connect();

//apn
var apn = require("apn");
var notify = new apn.Notification();
notify.device = new apn.Device("5a78ec2e464f1dad0b38c02524f23814971096ec805934e550042a6f090abf7c");
notify.badge = 0;

client.on("connect", function(){
	var j = schedule.scheduleJob('*/5 * * * * * ', function(){
		client.openMailbox("INBOX", function(error, info){
			if(count === 0){
				count = info.count;
			}else if(info.count > count){
				var newcount = info.count - count;
				count = info.count;
				notify.alert= "您有新信件";
				new apn.Connection({
					cert:'cert.pem',
				       key:'key.pem',
					gateway:'gateway.sandbox.push.apple.com',
				}).sendNotification(notify);
			}

	    });
	});
});
