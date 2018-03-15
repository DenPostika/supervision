import moment from 'moment/moment';

export const sortTracks = (records) => {
  moment.locale('uk');
  let sortedRecords = [],
    dates = [];

  for (let i = 0; i < records.length; i++) {
    const dayDate = moment(records[i].checkIn).format('L');
    dates[dayDate] = !dates[dayDate] ? [] : dates[dayDate];
    dates[dayDate].push(records[i]);
  }
  for (const day in dates) {
    let worktime = worktimeByDate(dates[day]),
      lastCheckIn = dates[day][dates[day].length - 1].checkIn,
      comming = dates[day][0].checkIn;
    sortedRecords.push({
      date: day,
      worktime,
      comming,
      leaving: worktime / 60 >= 9 ? lastCheckIn : null,
      onwork: !!(dates[day].length % 2)
    });
  }
  return sortedRecords;
};

function worktimeByDate(records) {
  let worktime = 0;
  const recordsSorted = records.sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn)).reverse();
  for (let i = 0; i < recordsSorted.length; i += 2) {
    if (recordsSorted[i + 1]) {
      worktime += moment(recordsSorted[i + 1].checkIn).diff(
                moment(recordsSorted[i].checkIn),
                'minutes'
            );
    }
  }

  return worktime;
}
