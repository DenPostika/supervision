import Bot from '../index';

export const hi = (slackUser, user) => {
  Bot.postMessageToUser(
    slackUser.name,
    `Привет, ${user.username} :spock-hand:`,
    {
      as_user: true,
    },
  );
};
