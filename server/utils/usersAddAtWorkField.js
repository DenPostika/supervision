import Tracking from '../models/tracking.model';

export const usersAddAtWorkField = users => {
  return new Promise(resolve => {
    console.log(users.length);
    for (let i = 0; i < users.length; i += 1) {
      Tracking.getTodayCheckIn().then(records => {
        users[i].atWork =
          records.length > 0 && records.length % 2 ? true : false;
      });
    }

    resolve(users);
  });
};
