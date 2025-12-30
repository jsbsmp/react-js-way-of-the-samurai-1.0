import Preloader from "../../common/Preloader/Preloader"
import classes from './ProfileInfo.module.css';
import userPhoto from '../../../assets/images/user.svg';
import ProfileStatusWithHooks from "./ProfileStatusWithHooks";
import { ChangeEvent, useState } from "react";
import ProfileDataReduxForm from "./ProfileDataForm";
import { SubmissionError } from 'redux-form';
import { ProfileType } from "../../../types/types";

type PropsType = {
  profile: ProfileType | null
  status: string
  updateStatus: (status: string) => void
  isOwner: boolean
  savePhoto: (file: File) => void
  saveProfile: (profile: ProfileType) => Promise<any>
}

const ProfileInfo: React.FC<PropsType> = ({ profile, status, updateStatus, isOwner, savePhoto, saveProfile }) => {

  let [editMode, setEditMode] = useState(false);

  if (!profile) {
    return <Preloader />;
  }

  const onMainPhotoSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      savePhoto(e.target.files[0]);
    }
  }

  const onSubmit = (formData: ProfileType) => {
    return saveProfile(formData)
      .then(() => {
        setEditMode(false);
      })
      .catch(error => {
        throw new SubmissionError({ _error: error });
      });
  }


  return <div>
    {/* <div>
      <img src='https://ohcbrands.com/wp-content/uploads/2018/04/69648590-header-wallpapers.jpg' alt='Profile Cover'></img>
    </div> */}
    <div className={classes.descriptionBlock}>
      <img className={classes.img} src={profile.photos.large || userPhoto} alt='Avatar' />
      <div>{isOwner && <input type="file" onChange={onMainPhotoSelected} />}</div>

      {editMode ? <ProfileDataReduxForm initialValues={profile} onSubmit={onSubmit} profile={profile} /> : <ProfileData goToEditMode={() => setEditMode(true)} profile={profile} isOwner={isOwner} />}
      <ProfileStatusWithHooks status={status} updateStatus={updateStatus} />
    </div>
  </div>
}

type ProfileDataPropsType = {
  profile: ProfileType
  isOwner: boolean
  goToEditMode: () => void
}

const ProfileData: React.FC<ProfileDataPropsType> = ({ profile, isOwner, goToEditMode }) => {
  return <div>
    {isOwner && <div><button onClick={goToEditMode}>Edit</button></div>}
    <div>
      <b>Full name:</b> {profile.fullName}
    </div>
    <div>
      <b>Looking for a job:</b> {profile.lookingForAJob ? "yes" : "no"}
    </div>
    {profile.lookingForAJob &&
      <div>
        <b>My professional skills:</b> {profile.lookingForAJobDescription}
      </div>
    }
    <div>
      <b>About me:</b> {profile.aboutMe}
    </div>
    <div>
      <b>Contacts:</b> {Object.keys(profile.contacts).map(key => {
        return <Contact contactTitle={key} contactValue={profile.contacts[key as keyof typeof profile.contacts]} key={key} />
      })}
    </div>
  </div>
}

type ContactPropsType = {
  contactTitle: string
  contactValue: string
}

const Contact: React.FC<ContactPropsType> = ({ contactTitle, contactValue }) => {
  return <div className={classes.contact}><b>{contactTitle}:</b> {contactValue}</div>
}

export default ProfileInfo;