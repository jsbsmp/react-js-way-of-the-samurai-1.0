import { instance, ApiResponseType, ResultCodesEnum, ResultCodesEnumForCaptcha } from "./api";

export type MeResponseType = {
    id: number;
    email: string;
    login: string;
};

export type LoginResponseType = {
    userId: number;
};

export const authAPI = {
    me: () => {
        return instance.get<ApiResponseType<MeResponseType>>(`auth/me`).then(response => response.data);
    },
    login: (email: string, password: string, rememberMe: boolean = false, captcha: string | null = null) => {
        return instance.post<ApiResponseType<LoginResponseType, ResultCodesEnum | ResultCodesEnumForCaptcha>>(`auth/login`, { email, password, rememberMe, captcha }).then(response => response.data);
    },
    logout: () => {
        return instance.delete(`auth/login`).then(response => response.data);
    }
};
