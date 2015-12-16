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
  var link="https://slack.com/api/chat.postMessage?token=xoxp-2315277109-4999683096-16794897169-67424f16cc&channel="+channel+"&text="+text+"&username="+username+"&as_user=yes&pretty=1";
  var ts ="";

  console.log(token);

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

    var dellink="https://slack.com/api/chat.delete?token=xoxp-2315277109-4999683096-16794897169-67424f16cc&ts="+ts+"&channel="+channel+"&pretty=1";
    function removeMsg () {
      https.get(dellink)
    };
    setTimeout(removeMsg,600000);

    });

  });

  res.end();

});

app.listen(process.env.PORT || 3000,function(){
  console.log("Started on PORT 3000");
});



