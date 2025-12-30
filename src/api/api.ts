import axios from "axios";
import { UserType } from "../types/types";

export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.0/',
    withCredentials: true,
    headers: {
        "API-KEY": "853237e2-afa7-4462-a98b-4b96ae0692e8"
    }
});

export enum ResultCodesEnum {
    Success = 0,
    Error = 1,
}

export enum ResultCodesEnumForCaptcha {
    CaptchaIsRequired = 10
}

export type GetUsersResponseType = {
    items: Array<UserType>
    totalCount: number
    error: string | null
}

export type ApiResponseType<D = {}, RC = ResultCodesEnum> = {
    data: D;
    resultCode: RC;
    messages: Array<string>;
};

