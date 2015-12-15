var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var https = require("https");
var util = require('util');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res){
  res.sendfile("index.html");
});

app.post('/',function(req,res){

  var token=req.body.token;
  var channel=req.body.channel_id;
  var text=req.body.text;
  var username=req.body.user_name;
  var link="https://slack.com/api/chat.postMessage?token="+token+"&channel="+channel+"&text="+text+"&username="+username+"&as_user=yes&pretty=1";
  var ts ="";

  console.log(link);

  https.get(link, function(res) {

    var bodyChunks = [];
    res.on('data', function(chunk) {

      bodyChunks.push(chunk);

    }).on('end', function() {
    var body = Buffer.concat(bodyChunks);
    console.log('BODY: ' + body);
    var obj = JSON.parse(body);
    ts = obj.ts;

    var dellink="https://slack.com/api/chat.delete?token="+token+"&ts="+ts+"&channel="+channel+"&pretty=1";
    function removeMsg () {
      https.get(dellink)
    };
    setTimeout(removeMsg,10000);

    });

  });

  res.end("msg sent");

  console.log(ts);
});

/* sendToSlack: function(attachment, integration, message) {
   request.post({
   json: true,
   url: 'https://slack.com/api/chat.postMessage',
   qs: {
     "token": integration.get('slack_token'),
     "channel": integration.get('channel_id'),
     "username": 'Partyline',
    },
   }, function(err, resp, body) {
     if (body.ok) {
       console.log(body);
     } else {
       console.log(err);
     }
   });
 };  

{
    "token":"xoxp-3586098260-3586109096-16554855155-f98be9a704"
    "team_id":"T0001"
    "team_domain":"example"
    "channel_id":"C03H82W8E"
    "channel_name":"test"
    "user_name":"John"
    "command":"/commandName"
    "text":"test"
}


 */

app.listen(80,function(){
  console.log("Started on PORT 80");
});



