import SimpleTime from './SimpleTime';

describe ('SimpleTime', () => {
    const oneHourAsMs = 3600000;
    const oneMinuteAsMs = 60000;

    it('Makes an object properly', () => {
        const result = new SimpleTime('1:00').timeInMs;
        expect(result).toEqual(oneHourAsMs);

        const msResult = new SimpleTime(oneHourAsMs).timeInMs;
        expect(result).toEqual(oneHourAsMs);
    });

    it('Parses string input properly', () => {
        const result = new SimpleTime('01:01').timeInMs;
        expect(result).toEqual(oneHourAsMs + oneMinuteAsMs)
    })
})
