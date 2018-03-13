import moment from 'moment/moment';

export const sortTracks = (records) => {
  let sortedRecords = [],
    dates = [];

  for (let i = 0; i < records.length; i++) {
    const dayDate = moment(records[i].checkIn).format('L');
    console.log(dayDate);
    dates[dayDate] = !dates[dayDate] ? [] : dates[dayDate];
    dates[dayDate].push(records[i]);
  }
  for (let day in dates) {
      let worktime = worktimeByDate(dates[day]),
        comming = dates[day][dates[day].length-1].checkIn,
        lastCheckIn = dates[day][0].checkIn;
        console.log(dates[day].length-1);
        sortedRecords.push({
          date: day,
          worktime: worktime,
          comming: comming,
          leaving: worktime.hours>=9 ? lastCheckIn : null
        });
  }
  return sortedRecords;
};

function worktimeByDate(records){
    let worktime = moment(records[0].checkIn).diff(
        moment(records[records.length-1].checkIn),
        'minutes',
    );
    return {
        hours: Math.round(worktime / 60),
        minutes: worktime % 60,
    };
}