# slacksim
A bot that simulates user comments in slack

Installation:

Create constants.js file at root level with following variables exported:
* apiToken : the slack Api token for your slack team.  Can not be the bot token, as the bot doesn't get API access.
* botToken : the slack bot token for the slack bot you want to respond to queries
* botId : the id of that slack bot so it can identify when it is summoned

Optional, if using twitter parsing:
* twitterConsumerKey: the key of your twitter dev account
* twitterConsumerSecret: the secret of your twitter dev account
* twitterAccessTokenKey: the twitter access token key for your app
* twitterAccessTokenSecret: the twitter access token secret for your app

Node dependencies:
* node-slack-sdk (https://github.com/slackhq/node-slack-sdk);
* node https
Optional, if you want to use twitter parsing as well:
* node Twitter

`node bot.js` to run the app

To summon the app, give it a call by name of bot with a username of a person, eg:
@slacksim cudabear

To summon the app to parse tweets, give it a call by name of bot with twitter keyword and a handle:
@slacksim twitter cudascubby