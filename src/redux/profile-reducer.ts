import { FormAction, stopSubmit } from "redux-form";
import { profileAPI } from "../api/profile-api";
import { PhotosType, PostType, ProfileType } from "../types/types";
import { BaseThunkType, InferActionsTypes } from "./redux-store";

let initialState = {
    posts: [
        { id: 1, message: "Hello, world!", likesCount: '10' },
        { id: 2, message: "It`s my first post", likesCount: '5' }
    ] as Array<PostType>,
    profile: null as ProfileType | null,
    status: ''
};

export type ProfileInitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType | FormAction>;

const profileReducer = (state = initialState, action: ActionsType): ProfileInitialStateType => {
    switch (action.type) {
        case 'SN/PROFILE/ADD-POST': {
            return {
                ...state,
                posts: [...state.posts, { id: 3, message: action.newPostText, likesCount: '0' }],
            };
        }
        case 'SN/PROFILE/SET_USER_PROFILE': {
            return { ...state, profile: action.profile };
        }
        case 'SN/PROFILE/SET_STATUS': {
            return { ...state, status: action.status };
        }
        case 'SN/PROFILE/DELETE_POST': {
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.postId)
            };
        }
        case 'SN/PROFILE/SAVE_PHOTO_SUCCESS': {
            return {
                ...state,
                profile: { ...state.profile, photos: action.photos } as ProfileType
            };
        }
        default:
            return state;
    }
}

export const actions = {
    addPostActionCreator: (newPostText: string) => ({ type: 'SN/PROFILE/ADD-POST', newPostText } as const),
    setUserProfile: (profile: ProfileType) => ({ type: 'SN/PROFILE/SET_USER_PROFILE', profile: profile } as const),
    setStatus: (status: string) => ({ type: 'SN/PROFILE/SET_STATUS', status } as const),
    deletePostActionCreator: (postId: number) => ({ type: 'SN/PROFILE/DELETE_POST', postId } as const),
    savePhotoSuccess: (photos: PhotosType) => ({ type: 'SN/PROFILE/SAVE_PHOTO_SUCCESS', photos } as const)
};

export const getUserProfile = (userId: number): ThunkType => async (dispatch) => {
    let response = await profileAPI.getProfile(userId);
    dispatch(actions.setUserProfile(response));
};

export const getStatus = (userId: number): ThunkType => async (dispatch) => {
    let response = await profileAPI.getStatus(userId);
    dispatch(actions.setStatus(response));
};

export const updateStatus = (status: string): ThunkType => async (dispatch) => {
    let response = await profileAPI.updateStatus(status);
    if (response.resultCode === 0) {
        dispatch(actions.setStatus(status));
    }
};

export const savePhoto = (photoFile: File): ThunkType => async (dispatch) => {
    let response = await profileAPI.savePhoto(photoFile);
    if (response.resultCode === 0) {
        dispatch(actions.savePhotoSuccess(response.data.photos));
    }
};

export const saveProfile = (profile: ProfileType): ThunkType => async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const response = await profileAPI.saveProfile(profile);
    if (response.resultCode === 0) {
        if (userId != null) {
            dispatch(getUserProfile(userId));
        } else {
            throw new Error("UserId can`t be null");
        }
    } else {
        dispatch(stopSubmit("edit-profile", { _error: response.messages[0] }));
        return Promise.reject(response.messages[0]);
    }
};

export default profileReducer;