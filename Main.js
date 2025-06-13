/*

Discord bot 

ressources : 
https://v12.discordjs.guide/creating-your-bot/#creating-the-bot-file
https://nodejs.org/en/learn/getting-started/nodejs-with-typescript
https://stackoverflow.com/questions/68695462/how-do-i-fix-client-missing-intents-error-discord-js

Ludowic "MagnusMoi" EMMANUEL 2025

*/

//#################################################
// You can edit values here
//#################################################

const str_token = "APP_Token";
const str_log_dir_location = "X:/YourPathWithoutSlashAtTheEnd";
const str_log_start_file = "/IYO_SPY_";
const str_refused_cmd_gif = "https://tenor.com/bXKAO.gif";
const ary_cmd_tags = [
	"magnusmoi",
	"dyorusse"
];
const ary_gifs = ["https://tenor.com/cWyyf2fEkk7.gif", 
	"https://tenor.com/lOAsMd79fVP.gif", 
	"https://tenor.com/fWYyqs4Z8e8.gif", 
	"https://tenor.com/svhGw8KWIbt.gif", 
	"https://tenor.com/swStiDX8Ea9.gif", 
	"https://tenor.com/bZFhR.gif", 
	"https://tenor.com/nUPZPsKAy43.gif", 
	"https://tenor.com/e2xocu2DFDO.gif", 
	"https://tenor.com/q8i35vyalUw.gif"
];
const float_percent_random_talk = 2.0;

//#################################################
// Don't
//#################################################

const date = require('date-and-time');
const fs = require('fs');
const Discord = require('discord.js');
const { error } = require('node:console');

const client = new Discord.Client({
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
    intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.GuildMessageReactions,
		Discord.GatewayIntentBits.GuildMessageTyping,
		Discord.GatewayIntentBits.MessageContent,
		Discord.GatewayIntentBits.DirectMessages, 
		Discord.GatewayIntentBits.DirectMessageReactions,
		Discord.GatewayIntentBits.DirectMessageTyping
    ]
});

const int_case_msg_analyse_Nothing = 0;
const int_case_msg_analyse_Called = 1;
const int_case_msg_analyse_Clap = 2;
const int_case_msg_analyse_Command = 3;

const str_random_msg = "👉😆👈";
//const str_random_msg = ":point_right::laughing::point_left:";
const str_Clap_call = "👏";
const str_Clap = "I believe in Joe Hendry !";

const str_command_start = "!IYO ";
const str_command_NotDevYet = "申し訳ありませんが、まだ開発されていません";
const str_bot_at = "@1368004783218229309";

let str_tag_User = null;
let ary_channel = [];

client.once('ready', () => {
	console.log('Iyo Sky is Ready! The goddess of the sky is here !');
	console.log("Logged in as " + client.user.tag + "!");
	str_tag_User = client.user.tag;
});

function existChannel(channel){

	let count = ary_channel.length;
	let iterator = 0;
	let item = null;

	while( count > iterator ){

		item = ary_channel[iterator];

		if(channel.guild.name == item.guild.name && channel.name == item.name)
			return true;

		iterator++;
	}

	return false;

	/*let ary_ = ary_channel.filter(function(item){
		return channel.guild.name == item.guild.name && channel.name == item.name;
	});
	return ary_.length > 0;*/
}

function addChannel(channel){

	if(!existChannel(channel))
		ary_channel.push(channel);
}

function responseGif(){
	
	let len = ary_gifs.length;
	let index = Math.floor( Math.random() * len );
	
	return ary_gifs[index];
}

function sendMessage(channel, txt){
	channel.send(txt);
}

function responseCommand(message){

	let index = ary_cmd_tags.indexOf(message.author.tag);

	if( index < 0 )
		sendMessage(message.channel, str_refused_cmd_gif);
	else 
		sendMessage(message.channel, str_command_NotDevYet);
}

function responseClap(message){
	sendMessage(message.channel, str_Clap);
}

function responseCalled(message){
	sendMessage(message.channel, responseGif());
}

function messageLogger(message){
	
	let now = new Date();
	let format = date.format(now, 'YYYYMMDD');
	let instant = date.format(now, 'YYYYMMDD_HHmmss');
	let file = str_log_dir_location + str_log_start_file + format + ".json";
	let msg = "";

	console.log('////////////////////////////////////// ' + instant);
	console.log('Message Guilds : ' + message.channel.guild.name);
	console.log('Message Channel : ' + message.channel.name);
	console.log('Message author : ' + message.author.tag);
	console.log('Message content : ' + message.content);

	msg += "{\r\n"
	msg += "\t" + "\"time\" : '" + instant + "',\r\n";
	msg += "\t" + "\"guildname\" : '" + message.channel.guild.name + "',\r\n";
	msg += "\t" + "\"channelname\" : '" + message.channel.name + "',\r\n";
	msg += "\t" + "\"authortag\" : '" + message.author.tag + "',\r\n";
	msg += "\t" + "\"content\" : '" + message.content + "'\r\n";
	msg += "},\r\n"
	
	fs.appendFile( file, msg, err => {
		if(err){
			console.error(err);
		}
		else{

		}
	} );

}

function analyseMessage(message){

	let msg = message.content;
	let value = int_case_msg_analyse_Nothing;

	if(msg.includes(str_bot_at))
		return int_case_msg_analyse_Called;

	if(msg.includes(str_Clap_call))
		return int_case_msg_analyse_Clap;

	if(msg.toLowerCase().startsWith(str_command_start.toLowerCase()))
		return int_case_msg_analyse_Command;

	return value;
}

function randomMessage(){
	let len = ary_channel.length;
	let gate = Math.floor( Math.random() * 100 );
	let channelIndex = 0;

	if(gate < float_percent_random_talk){
		channelIndex = Math.floor( Math.random() * len );
		console.log('############## Iyo Sky is Ready at ' + ary_channel[channelIndex].guild.name + '/' + ary_channel[channelIndex].name);
		sendMessage(ary_channel[channelIndex], str_random_msg);
	}

}

client.on(Discord.Events.MessageCreate, message => {

	let mode = int_case_msg_analyse_Nothing;

	messageLogger(message);

	addChannel(message.channel);

	mode = analyseMessage( message );

	switch(mode){
		case int_case_msg_analyse_Nothing :

		break;
		case int_case_msg_analyse_Called :
			responseCalled(message);
		break;
		case int_case_msg_analyse_Clap :
			responseClap(message);
		break;
		case int_case_msg_analyse_Command :
			responseCommand(message);
		break;
	}

	randomMessage();

});

client.login(str_token);