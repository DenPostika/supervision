import SlackBot from 'slackbots';
import config from '../../config/config';

const Bot = new SlackBot({
  token: config.slackToken,
});

Bot.on('message', (data) => {
  const user = Bot.getUsers()._value.members.find(obj => obj.id === data.user);
  console.log(user);
  if (data.type === 'message' && !data.bot_id) {
    Bot.postMessageToUser(user.name, `Hi, ${user.name}`, {
      as_user: true,
    });
  }
});

export default Bot;
