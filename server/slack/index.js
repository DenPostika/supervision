import SlackBot from 'slackbots';
import config from '../../config/config';

const Bot = new SlackBot({
  token: config.slackToken,
});

Bot.on('message', data => {
  console.log(data);
  if (data.type === 'message' && !data.bot_id) {
    Bot.postMessageToUser('denis_postyka', 'hi', {
      as_user: true,
    });
  }
});

export default Bot;
