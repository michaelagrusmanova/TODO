import React from 'react';

export function FlashMessage(props) {
    const theme = props.theme;
    const text = props.text;

    return (
        <div className={"alert alert-" + theme}>
            {text}
        </div>
    );
}

export default FlashMessage;