const { messageChanelId } = require('../config.json');
const { impersonalRoleId } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'msg',
    description: 'Сообщение для Impersonal Hope Team',
	usage: '[имя команды]',
	args: 1,
	cooldown: 5,
	onlyAdmin: true,
    execute(message, args) {
		
	   let msgChannel = message.guild.channels.cache.get(messageChanelId);
	   let impersonalPlayers = message.guild.roles.cache.get(impersonalRoleId).members.map(m=>m.user.id);

	   if(!msgChannel || !impersonalPlayers) {
			return message.reply('Канал для сообщений, либо роль Impersonal не настроены, обратитесь к разработчику..');
	   }

	   let mentions = "";

	   for (let i = 0; i < impersonalPlayers.length; i++) {
		  
		mentions += `<@${impersonalPlayers[i]}> `
		   
	   }

        const embedHelpCommand = new Discord.MessageEmbed()
			   .setAuthor(message.author.username, message.author.avatarURL())
			   .setDescription(args.join(' '))
			   .setColor('#7908AA')
			   .setTitle('Обращение к команде Impersonal');

		msgChannel.send(mentions, embedHelpCommand);
		
		message.delete();
    },
};