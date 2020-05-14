const { prefix } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Список команд бота.',
    usage: '[имя команды]',
    cooldown: 5,
    execute(message, args) {

        const data = [];
		const { commands } = message.client;
		

        if (!args.length) {
            data.push(commands.map(command => command.name).join(', '));

            const embedHelp = new Discord.MessageEmbed()
                .setColor('#000000')
                .setTitle('Список команд бота:')
                .setDescription(`${data}\n\nДля подробного описания команды используйте: \`${prefix}help [Команда]\``)

            message.channel.send(embedHelp);
            return;
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('Такой команды нету!');
        }

        let usageCommand = '';
        let cooldownCommand = 0;

        if(command.usage) {
            usageCommand = command.usage;
        }

        if(command.cooldown) {
            cooldownCommand = command.cooldown;
        }
       
        const embedHelpCommand = new Discord.MessageEmbed()
            .setColor('#7908AA')
            .setTitle(`Помощь по команде \`${command.name}\``)
            .addField('Описание команды:', `\`${command.description}\``)
            .addField(`Использование:`, `\`${prefix}${command.name} ${usageCommand}\``)
            .addField('Перезарядка', `\`${cooldownCommand}\``);

        message.channel.send(embedHelpCommand);
    },
};