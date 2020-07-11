console.log('Hi, I\'m clean bot');

const Discord = require('discord.js');
const Profane = require('bad-words');
const Mongoose = require('mongoose');
const dbOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify:true,
};
const { prefix, token } = require('./config.json');
const uri = 'mongodb+srv://fredhua233:XianzhiHua050603@cleanbot-cjxhk.mongodb.net/CleanBot?retryWrites=true&w=majority';
const discordClient = new Discord.Client();
const profane = new Profane();

Mongoose.connect(uri, dbOptions, () => console.log('Mongo Connected'));
const model = require('./models/model.js');
const db = Mongoose.connection;


discordClient.once('ready', () => {
	console.log('Ready!');
	// memberArray = discordClient.users.cache.filter(user => !user.bot).map(user => user.id);
	// memberLevel is array
	// TODO: put memberLevel as key in map.
});

db.on('error', console.error.bind(console, 'connection error:'));

discordClient.on('message', message => {
	model.exists({ guildID : message.guild.id }, function(err, doc) {
		if (err) {
			console.log(err);
			}
		else if(doc) {
			model.find({
				members : {
					$elemMatch : { memberID : message.author.id },
				},
			}, function(err, result) {
				if (err) {
					console.log('the error is: ');
					console.log(err);
				}
				else if(result.length !== 0) {
					console.log(result);
				}
				else {
					const user = {
						memberID : message.author.id,
						memberName : message.author.username,
						memberLevel : 0,
				};
				// TODO: filter out bot message
					model.updateOne(
						{ guildID : message.guild.id },
						{ $push : { members : user } },
					);
				}
			});
		}
		else {
			const tempModel = new model({
				_id : Mongoose.Types.ObjectId(),
				guildID : message.guild.id,
				guildName : message.guild.name,
				members : [{
					memberID : message.author.id,
					memberName : message.author.username,
					memberLevel : 0,
				}],
			});
			tempModel.save()
			.then(end => console.log(end))
			.catch(err => console.error(err));
		}
	});
	if(message.content === prefix) {
		message.channel.send('Hey! ' + message.author.username);
	}
	else if(profane.isProfane(message.content)) {
		message.channel.send('Oof ' + message.member.displayName + ' just said a bad word');
	}
});

// message.author.username is actual username
// where message.memeber.displayName is the guild member name
discordClient.on('message', message => {
	console.log(message.member.displayName + ': ');
	console.log(message.content);
});


discordClient.login(token);
