import React, {FunctionComponent} from 'react';
import './CLabel.css';

type Props = {
    htmlFor: string
}

const CLabel:FunctionComponent<Props> = ({children, htmlFor}) => {
    return (
        <label htmlFor={htmlFor} className="CLabel">{children}</label>
    )
}

export default CLabel