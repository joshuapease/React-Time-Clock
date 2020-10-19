import SimpleTime from '../models/SimpleTime';

export const hrToMs = (hr:number) => hr * 60 * 60 * 1000;
export const minToMs = (min:number) => min * 60 * 1000;
export const msToHours = (ms:number) => ms / 1000 / 60 / 60;

var highestTime = 0;
var pastNoon = false;

export const parseTimeString = (timeString:string) => {
    let formattedTimeString = timeString.toLowerCase().replace('\./g', '');
    const pm = formattedTimeString.includes('pm');
    formattedTimeString = formattedTimeString.replace('pm', '').trim();
    const [rawHr, rawMin] = formattedTimeString.trim().split(':');
    const hours = parseInt(rawHr, 10) + (pm ? 12 : 0);
    const mins = parseInt(rawMin, 10);
    return {
        hours,
        mins
    }
}

export interface IFormattedRow {
    title: string,
    time: SimpleTime,
    exception?: string
}

export interface ICalculatedRow extends IFormattedRow {
  duration: number
}

export interface ISummarizedRow {
  title: string,
  duration: number
}

export const parseRawText = (rawText:string):Array<IFormattedRow> => {
  let latestTime = 0;
  let isPm = false;

  if(!rawText.trim().length) {
    return [];
  }

  const ret = rawText
    .trim()
    .split('\n')
    .map(row => {
      const [timeString, title] = row.split('-');
      if(!timeString || !title) {
        return {
          title: '',
          time: new SimpleTime(0),
          exception: 'Missing timeString or title'
        }
      }
      let time = new SimpleTime(timeString?.trim());
      const timeMs = time.timeInMs;
      if(!isPm && timeMs < latestTime) {
        isPm = true;
      } else {
        latestTime = timeMs;
      }

      if(isPm) {
        time = new SimpleTime(timeString.trim() + ' pm');
      }

      return {
        title: title?.trim(),
        time,
      }
    });

    return ret;
}

export const calculateFormattedRow = (formattedRow:Array<IFormattedRow>):Array<ICalculatedRow> => {
  return formattedRow.map((x, i, arr) => {
    const nextRow = arr[i + 1];
    const duration = nextRow ? nextRow.time.timeInMs - x.time.timeInMs : 0;

    return {
      ...x,
      duration
    }
  });
}


export const summarizeFormattedRow = (formattedRow:Array<ICalculatedRow>):Array<ISummarizedRow> => {
  const map = new Map<string, ISummarizedRow>();
  formattedRow.forEach((row) => {
    const key = row.title;
    const prevVal = map.get(key);
    if(prevVal) {
      prevVal.duration = prevVal.duration +  row.duration;
      return;
    }
    map.set(key, {
      duration: row.duration,
      title: row.title
    });
  });

  return Array.from(map, ([key, value]) => {
    return value;
  }).sort((a, b) => b.title > a.title ? -1 : 1)
}

/*

var data = text
  .trim()
  .split('\n')
  .map(x => {
    var [timeString, title] = x.split('-');

    hours = parseInt(hours, 10);
    mins = parseInt(mins, 10);
    var time = new Date();
    time.setHours(hours, mins, 0);

    if(!pastNoon && time < highestTime) {
      pastNoon = true;
    } else {
      highestTime = time;
    }

    if(pastNoon) {
      time.setHours(hours + 12, mins, 0);
    }

    var ret =  {
      time,
      hours: time.getHours(),
      title: title.trim()
    }

    return ret;
  }).map((x, i, arr) => {
    var next = arr[i + 1];
    var nextTime = next ? next.time : null;
    var duration = nextTime ? msToHours(nextTime - x.time) : null;
    return {
      ...x,
      duration
    };
  });
*/