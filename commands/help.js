const { prefix } = require('../config.json');
const Discord = require('discord.js');
const commands = require('../index');

module.exports = {
    name: 'help',
    description: 'Список команд бота.',
    usage: '[имя команды]',
    cooldown: 5,
    execute(message, args) {

        const data = [];
		
        if (!args.length) {
            data.push(commands.map(command => command.name).join(', '));

            const embed = new Discord.MessageEmbed()
                .setColor('#000000')
                .setTitle('Список команд бота:')
                .setDescription(`${data}\n\nДля подробного описания команды используйте: \`${prefix}help [Команда]\``)

            message.channel.send(embed);
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
            .addField('Перезарядка', `\`${cooldownCommand}\` seconds`);

        message.channel.send(embedHelpCommand);
    },
};