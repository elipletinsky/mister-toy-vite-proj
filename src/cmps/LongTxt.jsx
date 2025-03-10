
import { useState} from 'react'
import {PropTypes} from "prop-types";
export function LongTxt({ txt, length = 100 }) {
    LongTxt.propTypes = {
        txt: PropTypes.string.isRequired
    }
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleIsExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const displayText = isExpanded ? txt : txt.slice(0, length);

    return (
        <div>
            <p onClick={toggleIsExpanded} >{displayText}{!isExpanded && txt.length > length && '...'}</p>
        </div>
    );
}