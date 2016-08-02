var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var https = require('https');
var constants = require('./constants');

var token = constants.apiToken;
var botToken = constants.botToken;
var botId = constants.botId;

var ids = {}

var rtm = new RtmClient(botToken);
rtm.start();

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message){
	console.log('Message: ', message);

	if(message.text && message.text.indexOf(botId) > - 1){
		var user = message.text.replace(/ /g, '').replace(botId, '').replace(':', '');
		let regex = '^<@\..*>$';

		if(user.match(query)){
			if(ids[user] != null){
				user = ids[user]
			} else {
				var croppedid = user.substring(2, user.length-2)
				var id =  rtm.dataStore.getUserById(croppedid)
				ids[user] = id
				user = id
			}
		}
		var channelId = message.channel;

		var ops = {
			host: 'slack.com',
			path: '/api/search.messages?token='+token+'&count=1000&query=from:'+user,
			method: 'GET',
		}

		// if(user == 'slacksim'){
		// 	rtm.sendMessage("You want me to do _WHAT_ to myself?", channelId, function(err, msg){

		// 	});
		// 	return;
		// }

		console.log('firing request for: '+user);
		var req = https.request(ops, function(res){
			var body = '';
			res.on('data', function(d){
				body += d;
			});
			res.on('end', function(){
				//console.log('the messages were: ', body);

				var responseData = JSON.parse(body);
				if(!responseData.messages || responseData.messages.total < 1){
					console.log('no messages found for that user');
					rtm.sendMessage("No messages found for: "+user, channelId, function(err, msg){

					});
					return;
				}
				var messages = [];
				responseData.messages.matches.forEach(function(match){
					//make sure messages end in a period
					var message = match.text;
					if(message[message.length-1] != "."){
						message += ".";
					}

					//split words from messages
					var words = match.text.split(/\s+/g);
					words.forEach(function(word){
						messages.push(word);
					});
				}, this);

				var cache = {
					'_START': []
				};

				//format message data
				cache['_START'].push(messages[0]);
				for(var i = 0; i < messages.length - 1; i++){
					if(!cache[messages[i]]){
						cache[messages[i]] = [];
					}

					cache[messages[i]].push(messages[i+1]);

					if(messages[i].match(/\.$/)){
						cache['_START'].push(messages[i+1]);
					}
				}

				//form sentance
				var currentWord = '_START';
				var str = '';
				var numWords = 5 + Math.floor(Math.random()*50);

				while(numWords > 0){
					var rand = Math.floor(Math.random()*cache[currentWord].length);
					str += cache[currentWord][rand];

					if(!cache[cache[currentWord][rand]]){
						currentWord = '_START';
						if(!cache[currentWord][rand].match(/\.$/)){
							str += '. ';
						}else{
							str += ' ';
						}
					}else{
						currentWord = cache[currentWord][rand];
						numWords--;
						str += ' ';
					}
				}

				console.log(str);
				rtm.sendMessage("@"+user + ": \""+str+"\"", channelId, function(err, msg){

				});
			});
		});
		req.end();

		req.on('error', function(e){
			console.error(e);
		});
	}
});
