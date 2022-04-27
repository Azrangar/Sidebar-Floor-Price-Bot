require('dotenv').config() // Load .env file
const fetch = require('node-fetch')
const Discord = require('discord.js')
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const nftpricesymbol= 'SOL'
const guild_ID= process.env.FRIKTION_GUILD_ID
const bot_ID= process.env.OG_BOT_ID

const getPrice = async () => {
	return fetch('https://api-mainnet.magiceden.dev/v2/collections/lightning_ogs/stats')
	       .then(res => {
            return res.json()
            })
	       .then(data => {
			const ogfloorPrice = String((data["floorPrice"] / 1000000000)).concat(" ",'SOL')
       
	     
			client.user.setPresence({
				game: {
					// Example: "Watching -5,52% | BTC"
					name: `${nftpricesymbol.toUpperCase()}`,
					type: 3 // Use activity type 3 which is "Watching"
				}
			})

			console.log('Updated price to', ogfloorPrice) 
			client.guilds.cache.find(guild => guild.id === guild_ID).me.setNickname(`OG ${(ogfloorPrice).toLocaleString().replace(/,/g,',')}`)
	

//catch(err => console.log('Error at api-mainnet.magiceden data:', err))

        })
   }

// Runs when client connects to Discord.
client.on('ready', () => {
	console.log('Logged in as', client.user.tag)

	getPrice() // Ping server once on startup
	// Ping the server and set the new status message every x minutes. (Minimum of 1 minute)
	setInterval(getPrice, Math.max(1, process.env.MC_PING_FREQUENCY || 1) * 60 * 1000)
})

// Login to Discord
client.login(bot_ID)