import Bot from '../index';
import moment from 'moment/moment';

export const firstComingMessage = user => {
  const workTime = moment();
  workTime.add(9, 'hours');
  Bot.postMessageToUser(
    user.slackName,
    `Привет, ${
      user.username
    }! Твой рабочий день закончится в *${workTime.format('LT')}*`,
    {
      as_user: true,
    },
  );
};

export const comingMessage = (user, workTime) => {
  Bot.postMessageToUser(
    user.slackName,
    `Ты отработал уже *${workTime.hours} ч ${
      workTime.minutes
    } м* ты можешь уйти в \`${moment()
      .add(workTime.minutes !== 0 ? 8 : 9 - workTime.hours, 'hours')
      .add(workTime.minutes !== 0 ? 60 - workTime.minutes : 0, 'minutes')
      .format('LT')}\``,
    {
      as_user: true,
    },
  );
};

export const overtimeMessage = (user) => {
    Bot.postMessageToUser(
        user.slackName,
        `Начало сверхурочной работы в \`${moment().format('LT')}\``,
        {
            as_user: true,
        },
    );
};

export const leavingMessage = (user, workTime) => {
  Bot.postMessageToUser(
    user.slackName,
    `День закончен ты отработал *${workTime.hours}ч ${workTime.minutes}м*`,
    {
      as_user: true,
    },
  );
};

export const pauseMessage = (user, workTime) => {
    Bot.postMessageToUser(
        user.slackName,
        `Ты отработал уже *${workTime.hours} ч ${
            workTime.minutes
        } м*. Тебе необходимо еще отработать \`${
            workTime.minutes !== 0 ? 8 - workTime.hours: 9 - workTime.hours
        }\` ч \`${workTime.minutes !== 0 ? 60 - workTime.minutes : 0}\` м`,
        {
            as_user: true,
        },
    );
};
