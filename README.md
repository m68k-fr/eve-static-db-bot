# eve-static-db-bot

[![Build Status](https://travis-ci.org/m68k-fr/eve-static-db-bot.svg?branch=master)](https://travis-ci.org/m68k-fr/eve-static-db-bot)
[![License](https://img.shields.io/github/license/m68k-fr/eve-static-db-bot.svg)](https://github.com/m68k-fr/eve-static-db-bot/blob/master/LICENSE)


This Discord bot displays EVE Online item infos.

* Features all ships, modules and blueprints, about 7500 items.
* Fuzzy search friendly: If your request matches multiple results, the bot will ask you to choose an answer between a list of possible responses.
* Based on the official EVE [STATIC DATA EXPORT](https://developers.eveonline.com/resource/resources).
* Chatting with this bot is supported in private messages.

![](https://drive.google.com/uc?export=download&id=1OPxN-ih3rBtDeHmzx5nAFEBAoO2ndnnn)


  
## What permissions does this bot require?

This bot requires the following channel permissions:

| Permission | Reason |
|---|---|
| Read Messages History| Allows the bot to read your request.
| Send Messages | Allows the bot to reply to your commands.
| Use External Emojis | Allows the bot to display EVE custom icons.
| Embed Links   | Allows the bot to post Discord rich embed content containing images (ship renders, module icons) and hyperlinks (an external EVE database website).
| Add Reactions | Allows the bot to post a trash icon reaction. You can click on it to quickly erase your datasheet response.
| Manage Messages | Allows the bot to clear the multiple choice text associated with a response.  

If you're not confident with the **Manage Messages** permission, you can still edit the bot role after installation to uncheck it.
Be aware, removing this, the bot won't be able to clean the temporary selection text, leaving unnecessary spam on your channel.

## Commands:

| Command | Description |
|---|---|
| /ed [itemName] | Display info about a specific eve online item.
| /help | Display information about available commands and current version.
| /invitebot | Provide a link to install this bot on your own Discord server.


*****

## Hosting your own copy:

* Node 8 is required.
* Your server must be accessible from outside to serve images (default port: 8000)
* Clone this repository.
* Download and unpack the [SDE](https://developers.eveonline.com/resource/resources) for TRANQUILITY archive inside your /datas folder. 
* Download and unpack the [IEC](https://developers.eveonline.com/resource/resources) Renders archive inside your /datas folder.
* Download and unpack the [IEC](https://developers.eveonline.com/resource/resources) Icons archive inside your /datas folder.
 
```
npm install
node app.js
```
Once ready, the console will display a message similar to this one:
```
Bot is ready, SDE YAML processed: 347 ship, 3810 module registered.
```


*****

## JSON Configuration:

Copy "*config.sample.json*" to "*config.json*" and edit your configuration file:  

__token:__  
Token of your Discord bot, visit https://discordapp.com/developers/docs/intro to get yours.

__prefix:__  
Your discord prefix command. (default is '/')

__thumbrooturl:__  
This bot is using Express to serve ship images and item icons.  
Provide your ip/domainname and port as a http url to link images. The service must be accessible from outside.


__wikidomain:__  
Website domain to link each ship page.


__eimojis:__  
Due to limited embed customization, Discord server eimojis are used to display eve online attribute icons:    
On your Discord server, go to "server settings" and "emoji" tab, then add all the custom eimojis provided in the /datas/eimojis folder.
Inside your Discord channel, use the command \\:myeimojishortcut: (example: \\:Caldari:) to get your personal eimojis codes. 
Report all resulting Ids for eimojis in your config.json file.

