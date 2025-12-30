import { InjectedFormProps, reduxForm } from "redux-form"
import { createField, GetStringKeys, Textarea } from "../../common/FormControls/FormControls"
import { minLengthCreator, required } from "../../../utils/validators/validators"

type PropsType = {}

export type AddPostFormValuesType = {
  newPostText: string
}

type AddPostFormValuesTypeKeys = GetStringKeys<AddPostFormValuesType>

const minLength2 = minLengthCreator(2);

let AddNewPostForm: React.FC<InjectedFormProps<AddPostFormValuesType, PropsType> & PropsType> = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <div>
        {createField<AddPostFormValuesTypeKeys>("Enter your text", "newPostText", [required, minLength2], Textarea)}
      </div>
      <div>
        <button>Add post</button>
      </div>
    </form>
  );
}

export default reduxForm<AddPostFormValuesType, PropsType>({ form: 'ProfileAddNewPostForm' })(AddNewPostForm);