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
    const hours = parseInt(rawHr, 10);
    const mins = parseInt(rawMin ?? 0, 10);
    return {
        hours: hours + (pm && hours < 12 ? 12 : 0),
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

export const calculateRow = (formattedRow:Array<IParsedRow>):Array<ICalculatedRow> => {
  return formattedRow.map((x, i, arr) => {
    const nextRow = arr[i + 1];
    const duration = nextRow ? nextRow.time.timeInMs - x.time.timeInMs : 0;

    return {
      ...x,
      duration
    }
  });
}


export const summarizeRows = (formattedRow:Array<ICalculatedRow>):Array<ISummarizedRow> => {
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

  return Array.from(map, ([key, value]) => value)
    .sort((a, b) => b.title > a.title ? -1 : 1)
}

export const totalRows = (rows:Array<ICalculatedRow|ISummarizedRow>, exclusions?:Array<string>):SimpleTime => {
  var totalMs = rows.reduce((acc, row) => {
    if(exclusions?.length && exclusions.includes(row.title)) {
      return acc;
    }
    return acc += row.duration;
  }, 0);

  return new SimpleTime(totalMs);
}
