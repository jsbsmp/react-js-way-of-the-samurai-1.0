import { InferActionsTypes } from './redux-store';

type MessageType = {
    id: number
    message: string
}

type DialogType = {
    id: number
    name: string
}

let initialState = {
    messages: [
        { id: 1, message: 'Hi' },
        { id: 2, message: 'How are you?' },
        { id: 3, message: 'How is your day?' }
    ] as Array<MessageType>,
    dialogs: [
        { id: 1, name: 'Sandis' },
        { id: 2, name: 'Tims' },
        { id: 3, name: 'Raivo' }
    ] as Array<DialogType>
};

export type DialogsInitialStateType = typeof initialState;

type ActionsType = InferActionsTypes<typeof actions>;

const dialogReducer = (state = initialState, action: ActionsType): DialogsInitialStateType => {
    switch (action.type) {
        case 'SN/DIALOGS/SEND-MESSAGE':
            let body = action.newMessageBody;
            return {
                ...state,
                messages: [...state.messages, { id: 4, message: body }]
            };
        default:
            return state;
    }
}

export const actions = {
    sendMessage: (newMessageBody: string) => ({ type: 'SN/DIALOGS/SEND-MESSAGE', newMessageBody } as const)
};

export default dialogReducer;   