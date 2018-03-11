import User from '../../models/user.model';
import Bot from '../index';

export const office = slackUser => {
  User.list().then(list => {
    let result = 'Сейчас в офисе :';
    let n = 1;
    list.forEach(employer => {
      result +=
        '\n ' +
        n +
        '. ' +
        employer.username +
        (employer.atWork ? ' :office:' : ' :house:');

      n += 1;
    });

    Bot.postMessageToUser(slackUser.name, result, {
      as_user: true,
    });
  });
}
