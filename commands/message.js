const { messageChanelId } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'msg',
    description: 'Сообщение для Impersonal Hope Team',
	usage: '[Роль], [Сообщение]',
	args: 2,
	cooldown: 5,
	onlyAdmin: true,
    execute(message, args) {
		
	   let msgChannel = message.guild.channels.cache.get(messageChanelId);

	   if(!msgChannel) {
			return message.reply('Канал для сообщений не настроен, обратитесь к разработчику..');
	   }

	   const role = args[0];
	   args.shift();
	   let msg = args.join(' ');

        const embed = new Discord.MessageEmbed()
			   .setAuthor(message.author.username, message.author.avatarURL())
			   .setDescription(msg)
			   .setColor('#7908AA')
			   .setTitle(`Обращение к участникам Discord канала`);

		msgChannel.send(`${role}`, embed);
		message.delete();
    },
};