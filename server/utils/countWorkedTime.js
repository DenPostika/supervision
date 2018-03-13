import moment from 'moment/moment';

export const countWorkedTime = records => {
  let worktime = 0;

  records.push({
    checkIn: moment().format(),
  });

  for (let i = 0; i < records.length; i += 2) {
    if (records[i + 1]) {
      worktime = moment(records[i + 1].checkIn).diff(
        moment(records[i].checkIn),
        'minutes',
      );
    }
  }

  return {
    hours: Math.round(worktime / 60),
    minutes: worktime % 60,
  };
};

export const sortTracks = records => {

    let sortedRecords = [];

    for (let i = 0; i < records.length; i ++) {

        let day = moment(records[i].checkIn).format('L');

        sortedRecords[day] = !sortedRecords[day] ? [] : sortedRecords[day];

        sortedRecords[day].push({
            date: day,
            worktime: 1,
            coming: true,
            leaving: null
        })
        // if (records[i + 1]) {
        //     worktime = moment(records[i + 1].checkIn).diff(
        //         moment(records[i].checkIn),
        //         'minutes',
        //     );
        // }
    }

    return sortedRecords;
};
