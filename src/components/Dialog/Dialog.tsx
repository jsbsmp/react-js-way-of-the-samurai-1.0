import React from 'react';
import classes from './Dialog.module.css';
import DialogItem from './DialogItem/DialogItem';
import Message from './Message/Message';
import { InjectedFormProps, reduxForm } from 'redux-form';
import { maxLengthCreator, minLengthCreator, required } from '../../utils/validators/validators';
import { createField, Textarea } from '../common/FormControls/FormControls';
import { DialogsInitialStateType } from '../../redux/dialog-reducer';

type OwnPropsType = {
  dialogPage: DialogsInitialStateType
  sendMessage: (newMessageBody: string) => void
}

export type NewMessageFormValuesType = {
  newMessageBody: string
}

type NewMessageFormValuesKeysType = Extract<keyof NewMessageFormValuesType, string>

const Dialog: React.FC<OwnPropsType> = (props) => {

  let dialogsElements = props.dialogPage.dialogs.map(d => (<DialogItem name={d.name} key={d.id} id={d.id} />));
  let messagesElements = props.dialogPage.messages.map(m => (<Message message={m.message} key={m.id} />));

  let addNewMessage = (values: NewMessageFormValuesType) => {
    props.sendMessage(values.newMessageBody);
  }

  return <div className={classes.dialogs}>
    <div className={classes.dialogsItems}>
      {dialogsElements}
    </div>
    <div className={classes.messages}>
      <div>
        <AddMessageFormRedux onSubmit={addNewMessage} />
      </div>
      {messagesElements}
    </div>
  </div>
}

const maxLength100 = maxLengthCreator(100);
const minLength2 = minLengthCreator(2);

type PropsType = {}

const AddMessageForm: React.FC<InjectedFormProps<NewMessageFormValuesType, PropsType> & PropsType> = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <div>
        {createField<NewMessageFormValuesKeysType>('Enter your message', 'newMessageBody', [required, maxLength100, minLength2], Textarea)}
      </div>
      <div>
        <button>Send</button>
      </div>
    </form>
  );
}

const AddMessageFormRedux = reduxForm<NewMessageFormValuesType, PropsType>({ form: 'dialogAddMessageForm' })(AddMessageForm);

export default Dialog;