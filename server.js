"use strict";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

let Botkit = require('botkit'),
    http = require('http'),
    formatter = require('./modules/formatter'),
    salesforce = require('./modules/salesforce'),

    controller = Botkit.slackbot(),

    bot = controller.spawn({
        token: SLACK_BOT_TOKEN
    });

bot.startRTM(err => {
    if (err) {
        throw new Error('Could not connect to Slack');
    }
});

controller.hears(['help'], 'direct_message,direct_mention,mention', (bot, message) => {
    bot.reply(message, {
        text: `You can ask me things like:
    "3 bedrooms in Boston between 500000 and 700000"
    "3 bedrooms in Boston"
    "Search in Boston"
    "Create Case"`
    });
});

controller.hears(['(.*) bedrooms in (.*) between (.*) and (.*)', '(.*) bedrooms in (.*) from (.*) to (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
    salesforce.findProperties({bedrooms: match[1], city: match[2], priceMin: match[3], priceMax: match[4]})
        .then(properties => bot.reply(message, {
            text: "I found these properties:",
            attachments: formatter.formatProperties(properties)
        }))
        .catch(error => bot.reply(message, error));
});

controller.hears(['(.*) bedrooms in (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
    salesforce.findProperties({bedrooms: match[1], city: match[2]})
        .then(properties => bot.reply(message, {
            text: "I found these properties:",
            attachments: formatter.formatProperties(properties)
        }))
        .catch(error => bot.reply(message, error));
});

controller.hears(['in (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
    salesforce.findProperties({city: match[1]})
        .then(properties => bot.reply(message, {
            text: "I found these properties:",
            attachments: formatter.formatProperties(properties)
        }))
        .catch(error => bot.reply(message, error));
});

controller.hears(['between (.*) and (.*)', 'from (.*) to (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
    salesforce.findProperties({priceMin: match[1], priceMax: match[2]})
        .then(properties => bot.reply(message, {
            text: "I found these properties:",
            attachments: formatter.formatProperties(properties)
        }))
        .catch(error => bot.reply(message, error));
});

controller.hears(['(.*) bedrooms'], 'direct_message,direct_mention,mention', (bot, message) => {
    salesforce.findProperties({bedrooms: match[1]})
        .then(properties => {
            bot.reply(message, {
                text: "I found these properties:",
                attachments: formatter.formatProperties(properties)
            })
        })
        .catch(error => bot.reply(message, error));
});

controller.hears(['price changes'], 'direct_message,direct_mention,mention', (bot, message) => {
    salesforce.findPriceChanges()
        .then(priceChanges => {
            bot.reply(message, {
                text: "Here are the recent price changes:",
                attachments: formatter.formatPriceChanges(priceChanges)
            })
        })
        .catch(error => bot.reply(message, error));
});


controller.hears(['create case', 'new case'], 'direct_message,direct_mention,mention', (bot, message) => {

    let askSubject = (response, convo) => {

        convo.ask("What's the subject?", (response, convo) => {
            askDescription(response, convo);
            convo.next();
        });

    };

    let askDescription = (response, convo) => {

        convo.ask('Enter a description for the case', (response, convo) => {
            console.log("###convo");
            let responses = convo.getResponsesAsArray();
            salesforce.createCase({subject: responses[0].answer, description: responses[1].answer})
                .then(_case => {
                    console.log(_case);
                    bot.reply(message, {
                        text: "I created the case:",
                        attachments: formatter.formatCase(_case)
                    });
                    convo.next();
                })
                .catch(error => {
                    bot.reply(message, error);
                    convo.next();
                });
        });

    };

    bot.reply(message, "OK, I can help you with that!");
    bot.startConversation(message, askSubject);

});

// To keep Heroku awake
http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Ok, dyno is awake.');
}).listen(process.env.PORT || 5000);
