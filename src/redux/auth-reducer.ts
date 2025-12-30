import { FormAction, stopSubmit } from "redux-form";
import { ResultCodesEnum, ResultCodesEnumForCaptcha } from "../api/api";
import { securityAPI } from "../api/security-api";
import { authAPI } from "../api/auth-api";
import { BaseThunkType, InferActionsTypes } from "./redux-store";

let initialState = {
    userId: null as number | null,
    email: null as string | null,
    login: null as string | null,
    isAuth: false,
    captchaUrl: null as string | null
};

export type AuthInitialStateType = typeof initialState;

const authReducer = (state = initialState, action: ActionsType): AuthInitialStateType => {
    switch (action.type) {
        case 'SN/auth/SET_USER_DATA':
        case 'SN/auth/GET_CAPTCHA_URL_SUCCESS': {
            return {
                ...state,
                ...action.payload
            };
        }
        default:
            return state;
    }
}

export const actions = {
    setAuthUserData: (userId: number | null, email: string | null, login: string | null, isAuth: boolean) => ({
        type: 'SN/auth/SET_USER_DATA', payload: { userId, email, login, isAuth }
    } as const),
    GetCaptchaUrlSuccessActionType: (captchaUrl: string) => ({
        type: 'SN/auth/GET_CAPTCHA_URL_SUCCESS',
        payload: { captchaUrl }
    } as const)
};

type ActionsType = InferActionsTypes<typeof actions>;

type ThunkType = BaseThunkType<ActionsType | FormAction>;

export const getAuthUserData = (): ThunkType => async (dispatch) => {
    let response = await authAPI.me();
    if (response.resultCode === ResultCodesEnum.Success) {
        let { id, email, login } = response.data;
        dispatch(actions.setAuthUserData(id, email, login, true));
    }
};

export const login = (email: string, password: string, rememberMe: boolean, captcha: string): ThunkType => async (dispatch) => {
    let response = await authAPI.login(email, password, rememberMe, captcha);
    if (response.resultCode === ResultCodesEnum.Success) {
        dispatch(getAuthUserData());
    } else {
        if (response.resultCode === ResultCodesEnumForCaptcha.CaptchaIsRequired) {
            dispatch(getCaptchaUrl());
        }
        dispatch(stopSubmit("login", { _error: response.messages.length > 0 ? response.messages[0] : "Some error" }));
    }
};

export const logout = (): ThunkType => async (dispatch) => {
    let response = await authAPI.logout();
    if (response.resultCode === ResultCodesEnum.Success) {
        dispatch(actions.setAuthUserData(null, null, null, false));
    }
};

export const getCaptchaUrl = (): ThunkType => async (dispatch) => {
    const response = await securityAPI.getCaptchaUrl();
    const captchaUrl = response.url;
    dispatch(actions.GetCaptchaUrlSuccessActionType(captchaUrl));
}

export default authReducer;