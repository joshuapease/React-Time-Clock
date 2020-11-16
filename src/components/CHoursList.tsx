import React, {FunctionComponent} from 'react';
import './CHoursList.css';
import * as TimeUtils from '../utilities/TimeUtils';
import copy from 'copy-to-clipboard';
import { ClipboardText } from "phosphor-react";

type CHoursListProps = {
    rows: Array<TimeUtils.ISummarizedRow>,
    exclusions: Array<string>
}

const isExclusion = (row:TimeUtils.ISummarizedRow, exclusions:Array<string>) => {
    return exclusions.includes(row.title);
}

const copyHours = (hours:string):void => {
    copy(hours);
}

const CHoursList:FunctionComponent<CHoursListProps> = ({rows, exclusions}) => {
    const total = TimeUtils.totalRows(rows, exclusions);
    const totalFormatted = TimeUtils.msToHours(total.timeInMs);
    return (
        <table className="CHoursList">
            <tbody>
                {rows.map(row => {
                    const hours = TimeUtils.msToHours(row.duration).toFixed(2);
                    const key = row.title+row.duration;
                    return (
                        <tr key={key} className={isExclusion(row, exclusions) ? 'is-excluded' : ''}>
                            <th scope="row" className="CHoursList__title">{row.title}</th>
                            <td className="CHoursList__duration">
                                <button className="CHoursList__copy" onClick={e => copyHours(hours)}>
                                    <ClipboardText className="CHoursList__icon" weight="duotone" /> {hours}
                                </button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
            <tfoot>
                <tr>
                    <th className="CHoursList__title">Total</th>
                    <td className="CHoursList__duration">{totalFormatted}</td>
                </tr>
            </tfoot>
        </table>
    );
}

export default CHoursList;