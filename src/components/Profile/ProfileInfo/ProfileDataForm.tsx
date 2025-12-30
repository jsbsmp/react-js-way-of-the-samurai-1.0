import { InjectedFormProps, reduxForm } from "redux-form";
import classes from './ProfileInfo.module.css';
import { createField, GetStringKeys, Input, Textarea } from "../../common/FormControls/FormControls";
import { ProfileType } from "../../../types/types";

type PropsType = {
    profile: ProfileType
}

type ProfileTypeKeys = GetStringKeys<ProfileType>;

const ProfileDataForm: React.FC<InjectedFormProps<ProfileType, PropsType> & PropsType> = ({ handleSubmit, profile, error }) => {
    return (<form onSubmit={handleSubmit}>
        <div><button>Save</button></div>
        {error && <div className={classes.formSummaryError}>{error}</div>}
        <div>
            <b>Full name:</b> {createField<ProfileTypeKeys>("Full name", "fullName", [], Input)}
            <div>
                <b>Looking for a job:</b>
                {createField<ProfileTypeKeys>("", "lookingForAJob", [], Input, { type: "checkbox" })}
            </div>
            <div>
                <b>My professional skills:</b>
                {createField<ProfileTypeKeys>("My professional skills", "lookingForAJobDescription", [], Textarea)}
            </div>
            <div>
                <b>About me:</b>
                {createField<ProfileTypeKeys>("About me", "aboutMe", [], Textarea)}
            </div>
            <div>
                <b>Contacts:</b> {Object.keys(profile.contacts).map(key => {
                    return <div className={classes.contact} key={key}>
                        <b>{key}:</b> {createField(key, "contacts." + key, [], Input)}
                    </div>
                })}
            </div>
        </div>
    </form>
    );
}

const ProfileDataReduxForm = reduxForm<ProfileType, PropsType>({
    form: 'edit-profile',
    enableReinitialize: true,
    destroyOnUnmount: false
})(ProfileDataForm);

export default ProfileDataReduxForm;