// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
//const mm = MessageManager;

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	//console.log('interaction: ', interaction);
	const { commandName, channel } = interaction;
  let messages = [];
  let summary = "";
  let date;
  let prvAuthor;
	if (commandName === 'summary') {
    const firstMsg = interaction.options.getString('first');
    const msgLimit = interaction.options.getNumber('limit');
    console.log('firstMsg', firstMsg);
    console.log('msgLimit', msgLimit);

    //TODO: Add details for replies: add the message it refers to (small & italic)


    channel.messages.fetch({
      limit: msgLimit, // Amount of messages to be fetched in the channel
      after: firstMsg,
    })
      .then(msg => {


        channel.messages.fetch(firstMsg).then(msgStart => {

          //console.log(msgStart);
          messages = Array.from(msg);
          messages.push([msgStart.id,msgStart]);
          console.log('-------');
          //console.log(messages);

          messages.reverse().pop();


          prvAuthor = messages[0][1].author.id;
          messages.forEach(m => {
            date = new Date(m[1].createdTimestamp);
            if (m[1].author.id !== prvAuthor ) {
              summary = summary + "<hr>"
              prvAuthor = m[1].author.id;
            }
            /*while (m[1].content.search('```') >= 0) {
              console.log("code segment found!");
              m[1].content = m[1].content.replace('```', '\\`\\`\\`')
              //console.log("m.content: ", m[1].content);
            }*/
            /* if (m[1].reference.messageId) {
               console.log(m[1].reference.messageId);
               channel.messages.fetch(m[1].reference.messageId).then(msg => {

               });
             };*/

            summary = summary + `![](https://cdn.discordapp.com/avatars/${m[1].author.id}/${m[1].author.avatar}.webp?size=32)`
              + ` **${m[1].author.username}** at ${date}<br>`
              + `message: ${m[1].content} <br>`;
          });
          // summary = summary + "```";
          //console.log('summary: ', summary);

          fs.writeFile("./summary.txt", summary, function(err) {
            if(err) {
              return console.log(err);
            }
            console.log("The file was saved!");
            const embed = new MessageEmbed()
              .setColor('#0099ff')
              .setTitle('Create Summary')
              .setURL('https://dev.lisk.com/new-topic?title=TOPIC_TITLE&body=Update%20the%20title%20and%20paste%20here%20the%20contents%20of%20summary.txt')
              .setDescription('Copy & paste the content of `summary.txt` to dev.lisk.com by clicking "Create Summary":');
            interaction.reply({content:`summary.txt`, ephemeral: true, embeds: [embed], files: ['./summary.txt']});
          });
        }).catch(console.error);
      }).catch(console.error);

	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	} else if (commandName === 'ping') {
		await interaction.reply(`Pong! Websocket heartbeat: ${client.ws.ping}ms.`);
	} else if (commandName === 'react') {
    const message = await interaction.reply({ content: 'You can react with Unicode emojis!', fetchReply: true });
    message.react('😄');
  }
});

// Login to Discord with your client's token
client.login(token);
