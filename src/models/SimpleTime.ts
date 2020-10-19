import * as TimeUtils from '../utilities/TimeUtils';
export default class SimpleTime {
    timeInMs: number;
    seconds: number;
    minutes: number;
    hours: number;
    /**
     * @param time Can be a formatted string 00:00:00 or time in milleseconds
     */
    constructor(time: string | number) {
        let ms = 0;
        if (typeof time == "string") {
            const result = TimeUtils.parseTimeString(time);
            this.timeInMs = TimeUtils.hrToMs(result.hours) + TimeUtils.minToMs(result.mins);
        } else {
            this.timeInMs = time;
        }

        // const milliseconds = (this.timeInMs % 1000) / 100;
        this.seconds = Math.floor((this.timeInMs / 1000) % 60);
        this.minutes = Math.floor((this.timeInMs / (1000 * 60)) % 60);
        this.hours = Math.floor((this.timeInMs / (1000 * 60 * 60)) % 24);
    }
}
