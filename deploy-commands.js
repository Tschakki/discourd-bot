const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId, guildId } = require('./config.json');

console.log(clientId);
console.log(guildId);

const commands = [
	new SlashCommandBuilder().setName('summary')
    .setDescription('Create a summary for https://dev.lisk.com !')
    .addStringOption(option => option.setName('first').setDescription('Enter first message ID'))
    .addNumberOption(option => option.setName('limit').setDescription('How many messages are included in the summary')),
  /*new SlashCommandBuilder().setName('ping')
    .setDescription('Replies with pong!'),
  new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
	new SlashCommandBuilder().setName('react').setDescription('Reactions!'),*/
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId[1]), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
