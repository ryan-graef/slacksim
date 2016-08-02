# slacksim
A bot that simulates user comments in slack

Installation:

Create constants.js file at root level with following variables exported:
* apiToken : the slack Api token for your slack team.  Can not be the bot token, as the bot doesn't get API access.
* botToken : the slack bot token for the slack bot you want to respond to queries
* botId : the id of that slack bot so it can identify when it is summoned

`node bot.js` to run the app
