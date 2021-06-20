const Discord = require('discord.js')
const client = new Discord.Client()

var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('db.sqlite')

var moment = require('moment-timezone')

db.serialize(() => {
    db.run(`CREATE TABLE if NOT EXISTS users (id INT, date TEXT, flag INT)`)
})

client.on('ready', () => {
    console.log(`${client.user.tag} is on!`)
})

client.on('message', msg => {

    prefix = 'm.'

    // Checks to not reply in DM's, bots, or other prefixes.

    if (msg.content.substring(0,prefix.length) !== prefix) return
    if (msg.channel.type == 'dm') return
    if (msg.author.bot) return

    let command = msg.content.split(" ")[0].slice(prefix.length)
    let args = msg.content.split(" ").slice(1)

    if (command == 'add') {

        db.get(`SELECT id FROM users WHERE id='${msg.author.id}'`, (err, row) => {
            
            if(!row) {
            
                const filter = m => m.author.id === msg.author.id

                msg.channel.send('Enter your birthday in the format DD-MM-YYYY')

                msg.channel.awaitMessages(filter, {max: 1, time: 5000})
                    .then(collected => {
                        db.run(`INSERT into users VALUES (?,?,?), (${msg.author.id}, '${collected.first().content}', 0)`)
                        msg.channel.send("Success!")
                })  

            }

            else
                msg.channel.send('Your birthday already exists! Use the update or delete command to make changes.')

        })
        
    }

})


client.login('Mjk5NjMxMDUzMjkzODc5Mjk2.WOabKQ.cXR_ROoEtU2j_j_dzBygYT7cmvE')