import SlackBot from 'slackbots';
import config from '../../config/config';
import User from '../models/user.model';
import { office } from './commands/office';
import { hi } from './commands/hi';

const Bot = new SlackBot({
  token: config.slackToken,
});

Bot.on('message', data => {
  const slackUser = Bot.getUsers()._value.members.find(
    obj => obj.id === data.user,
  );
  if (data.type === 'message' && !data.bot_id) {
    User.find({ slackName: slackUser.name })
      .exec()
      .then(result => {
        const user = result[0];
        if (data.text.indexOf('office') !== -1 && user.type === 'admin') {
          office(slackUser);
        } else if (data.text.indexOf('Привет') !== -1) {
          hi(slackUser, user);
        }
      });
  }
});

export default Bot;
