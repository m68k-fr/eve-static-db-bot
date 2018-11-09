# eve-static-db-bot

This Discord bot allow you to display EVE Online ship datasheets.

* Features about 350 ships.
* Fuzzy search friendly: If your request matches multiple results, the bot will ask you to choose an anwser between the list of possible responses.
* Based only on the official EVE [STATIC DATA EXPORT](https://developers.eveonline.com/resource/resources).
* Integrate official ship rendering.


![](https://drive.google.com/uc?export=download&id=1OPxN-ih3rBtDeHmzx5nAFEBAoO2ndnnn)

*****

## List of commands:

**/ed [ship name]**  
Displays info about a specific eve online ship:  

**/help**  
Display the list of available commands.

**/invitebot**  
Provides a link to install this bot on your own discord server.

*****

## Install & Running:

* Clone this repository.
* Download and unpack the [SDE](https://developers.eveonline.com/resource/resources) for TRANQUILITY archive inside your /datas folder. 
* Download and unpack the [IEC](https://developers.eveonline.com/resource/resources) Renders archive inside your /datas folder.
```
npm install
node app.js
```
Once ready, the console will display a message similar to this one:
```
Bot is ready, SDE YAML processed: 347 ship registered.
```


*****

## JSON Configuration:

Copy "*config.sample.json*" to "*config.json*" and edit your configuration file:  

__token:__  
Token of your Discord bot, visit https://discordapp.com/developers/docs/intro to get yours.

__prefix:__  
Your discord prefix command. (default is '/')

__thumbrooturl:__  
This bot is using Express to serve images.  
Provide your ip/domainname and port as a http url to link images. The service must be accessible from outside.


__wikidomain:__  
Website domain to link each ship page.


__eimojis:__  
Due to limited embed customization, Discord server eimojis are used to display custom eve online icons:    
On your Discord server, go to "server settings" and "emoji" tab, then add all the custom eimojis provided in the /datas/eimojis folder.
Inside your Discord channel, use the command \\:myeimojishortcut: (example: \\:Caldari:) to get your personal eimojis codes.  
Report all resulting Ids for eimojis in your config.json file.

