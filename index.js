const fs = require('fs')
const Discord = require('discord.js');
const Client = require('./client/Client');
const { prefix,token } = require('./config.json');

const cooldowns = new Discord.Collection();
const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

console.log(client.commands);

client.once('ready', () => {
	console.log('Ready!');
});


client.on('message', message => {

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;
	
	const command = client.commands.get(commandName);


	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('Эта команда работает только в каналах!');
	}

	if(command.onlyAdmin && !message.member.hasPermission('ADMINISTRATOR')) {
		return message.reply('Для команды нужны права администратора.')
	}

	if (command.args && !args.length) {;
		let reply = `${message.author}\nДля команды нужны аргументы`;

		if(command.usage) {
			reply += `\nВот пример для этой команды: \`\`\`${prefix}${command.name} ${command.usage}\`\`\``;

		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Воу, полегче, подожди ещё ${timeLeft.toFixed(1)} секунд перед использованием \`${command.name}\`.`);
		}
	} else {
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('Что-то пошло не так, обратитесь к всемогущему разработчику!');
	}
});


client.login(token);