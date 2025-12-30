import React from 'react';
import classes from './../Dialog.module.css';

type PropsType = {
    message: string
}

const Message: React.FC<PropsType> = (props) => {
    return <div className={classes.message}>
        {props.message}
    </div>
}

export default Message;