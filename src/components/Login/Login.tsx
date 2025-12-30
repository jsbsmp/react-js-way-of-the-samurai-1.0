import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { InjectedFormProps, reduxForm } from "redux-form";
import { login } from "../../redux/auth-reducer";
import { AppStateType } from "../../redux/redux-store";
import { required } from "../../utils/validators/validators";
import { createField, GetStringKeys, Input } from "../common/FormControls/FormControls";
import styles from '../common/FormControls/FormControls.module.css';

type loginFormOwnProps = {
    captchaUrl: string | null
}

const LoginForm: React.FC<InjectedFormProps<LoginFormValuesType, loginFormOwnProps> & loginFormOwnProps> = ({ handleSubmit, error, captchaUrl }) => {
    return (
        <form onSubmit={handleSubmit}>
            {createField<LoginFormValuesTypeKeys>("Email", "email", [required], Input)}
            {createField<LoginFormValuesTypeKeys>("Password", "password", [required], Input, { type: "password" })}
            {createField<LoginFormValuesTypeKeys>(undefined, "rememberMe", [], Input, { type: "checkbox" }, "remember me")}
            {captchaUrl && <img src={captchaUrl} alt="captcha" />}
            {captchaUrl && createField<LoginFormValuesTypeKeys>("Symbols from image", "captcha", [required], Input, {})}
            {error && <div className={styles.formSummaryError}>{error}</div>}
            <button>Login</button>
        </form>
    );
}

const LoginReduxForm = reduxForm<LoginFormValuesType, loginFormOwnProps>({ form: 'login' })(LoginForm);

type LoginFormValuesType = {
    email: string
    password: string
    rememberMe: boolean
    captcha: string
}

type LoginFormValuesTypeKeys = GetStringKeys<LoginFormValuesType>

export const LoginPage: React.FC = () => {

    const captchaUrl = useSelector((state: AppStateType) => state.auth.captchaUrl);
    const isAuth = useSelector((state: AppStateType) => state.auth.isAuth);
    const dispatch = useDispatch() as any;

    const onSubmit = (formData: LoginFormValuesType) => {
        dispatch(login(formData.email, formData.password, formData.rememberMe, formData.captcha));
    }

    if (isAuth) {
        return <Navigate to={"/profile"} />;
    }

    return (
        <div>
            <h1>Login</h1>
            <LoginReduxForm onSubmit={onSubmit} captchaUrl={captchaUrl} />
        </div>
    );
}