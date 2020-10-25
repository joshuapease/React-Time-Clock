import SimpleTime from '../models/SimpleTime';
import * as TimeUtils from './TimeUtils';



describe('TimeUtils', () => {


    const formattedRowResult:Array<TimeUtils.IParsedRow> = [
        {
            title: 'Start',
            time: new SimpleTime('9:00')
        },
        {
            title: 'Next Thing',
            time: new SimpleTime('10:00')
        },
        {
            title: 'Bye!',
            time: new SimpleTime('11:30')
        },
        {
            title: 'Next Thing',
            time: new SimpleTime('2:00 pm')
        },
        {
            title: 'Stuff',
            time: new SimpleTime('4:30 pm')
        }
    ];

    const calculatedRowResult:Array<any> = [
        {
            title: 'Start',
            time: new SimpleTime('9:00'),
            duration: TimeUtils.hrToMs(1)
        },
        {
            title: 'Next Thing',
            time: new SimpleTime('10:00'),
            duration: TimeUtils.hrToMs(1.5)
        },
        {
            title: 'Bye!',
            time: new SimpleTime('11:30'),
            duration: TimeUtils.hrToMs(2.5)
        },
        {
            title: 'Next Thing',
            time: new SimpleTime('2:00 pm'),
            duration: TimeUtils.hrToMs(2.5)
        },
        {
            title: 'Stuff',
            time: new SimpleTime('4:30 pm'),
            duration: 0
        }
    ];


    describe('parseTimeString', () => {
        it('Parses am time string properly', () => {
            expect(TimeUtils.parseTimeString('4:00')).toEqual({
                hours: 4,
                mins: 0
            })
        })

        it('Am doesn\'t screw things up', () => {
            expect(TimeUtils.parseTimeString('4:00 am')).toEqual({
                hours: 4,
                mins: 0
            })
        })

        it('Parses pm time string properly', () => {
            expect(TimeUtils.parseTimeString('4:00 pm')).toEqual({
                hours: 16,
                mins: 0
            })
        })

        it('Parses single hour properly', () => {
            expect(TimeUtils.parseTimeString('1 pm')).toEqual({
                hours: 13,
                mins: 0
            })
        })
    })

    describe('parseRawText', () => {
        const inputText = `
            9:00 - Start
            10:00 am - Next Thing
            11:30 - Bye!
            2:00 - Next Thing
            4:30 - Stuff
        `;

        const newInputText = `
            9:00 - A  \n
            10:00 am - B
            1 pm - C
        `;

        const expected:Array<TimeUtils.IParsedRow> =  [
            {
                time: new SimpleTime('9:00'),
                title: 'A'
            },
            {
                time: new SimpleTime('10:00 am'),
                title: 'B'
            },
            {
                time: new SimpleTime('1 pm'),
                title: 'C'
            }
        ];

        it('New Regex Works', () => {
            expect(TimeUtils.parseRawText(newInputText)).toEqual(expected)
        })

        it('Parses Raw Text Properly', () => {
            const result = TimeUtils.parseRawText(inputText);
            expect(result).toEqual(formattedRowResult);
        })

        it('Handles empty input properly', () => {
            expect(TimeUtils.parseRawText('')).toEqual([]);
        });

        it('Handles partial input properly', () => {
            expect(TimeUtils.parseRawText(`fasdkl`)).toEqual([TimeUtils.ParsingError.NoTimeFound]);
        });
    })

    describe('calculateFormattedRow', () => {
        it('Calculates properly', () => {
            const result = TimeUtils.calculateFormattedRow(formattedRowResult);
            expect(result.map(x => x.duration)).toEqual(calculatedRowResult.map(x => x.duration));
        })
    })

    describe('summarizeFormattedRow', () => {
        const summarizedRow:Array<TimeUtils.ISummarizedRow> = [
            {
                title: 'Bye!',
                duration: TimeUtils.hrToMs(2.5)
            },
            {
                title: 'Next Thing',
                duration: TimeUtils.hrToMs(4)
            },
            {
                title: 'Start',
                duration: TimeUtils.hrToMs(1)
            },
            {
                title: 'Stuff',
                duration: 0
            }
        ];

        it('Summarizes properly', () => {
            expect(TimeUtils.summarizeFormattedRow(calculatedRowResult)).toEqual(summarizedRow)
        })
    })

})