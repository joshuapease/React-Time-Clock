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
    const mins = parseInt(rawMin ?? 0, 10);
    return {
        hours,
        mins
    }
}

export interface IParsedRow {
    title: string,
    time: SimpleTime,
}

export interface ICalculatedRow extends IParsedRow {
  duration: number
}

export interface ISummarizedRow {
  title: string,
  duration: number
}

export enum ParsingError {
  NoTimeFound = "Could not find a time in row"
}

export const isIParsedRow = (row:IParsedRow|ParsingError) : row is IParsedRow => {
  return (row as IParsedRow).title !== undefined;
}

const matchTime = /(?<hr>\d{1,2}):?(?<min>\d{2})?:?(?<sec>\d{2})?\s*(?<meridiem>am|pm)?/;

// Matches dashes and whitespace at the start of the string. Whitespace at end of string
const cleanTitle = /^[\s|-]+|\s+$/g;

export const parseRawText = (rawText:string):Array<IParsedRow|ParsingError> => {
  let latestTime = 0;
  let isPm = false;

  return rawText
    .trim()
    .split('\n')
    .filter(x => x.trim().length > 0)
    .map(row => {
      const match = row.match(matchTime);
      if(!match || !match.groups || !match.groups.hr) {
        return ParsingError.NoTimeFound;
      }
      const title = row.replace(matchTime, '').replace(cleanTitle, '');
      const timeString = `${match.groups.hr}:${match.groups.min ?? '00'} ${match.groups.meridiem ?? 'am'}`;
      let time = new SimpleTime(timeString);

      if(!isPm && time.timeInMs < latestTime) {
        isPm = true;
      } else {
        latestTime = time.timeInMs;
      }

      if(isPm && time.timeInMs < hrToMs(12)) {
        time = new SimpleTime(time.timeInMs + hrToMs(12));
      }

      return  {
        title,
        time
      }
    })
}

export const calculateFormattedRow = (formattedRow:Array<IParsedRow>):Array<ICalculatedRow> => {
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