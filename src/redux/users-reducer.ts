import { usersAPI } from "../api/users-api";
import { updateObjectInArray } from "../utils/objects-helpers";
import { UserType } from '../types/types';
import { BaseThunkType, InferActionsTypes } from './redux-store';
import { Dispatch } from 'redux';

let initialState = {
    users: [] as Array<UserType>,
    pageSize: 10,
    totalUsersCount: 0,
    currentPage: 1,
    isFetching: true,
    followingInProgress: [] as Array<number>,
    filter: {
        term: '',
        friend: null as null | boolean
    }
};

export type UsersInitialType = typeof initialState;
export type FilterType = typeof initialState.filter;

type ActionTypes = InferActionsTypes<typeof actions>;

const usersReduser = (state = initialState, action: ActionTypes): UsersInitialType => {
    switch (action.type) {
        case 'SN/USERS/FOLLOW': {
            return {
                ...state,
                users: updateObjectInArray(state.users, action.userId, "id", { followed: true })
            };
        }
        case 'SN/USERS/UNFOLLOW': {
            return {
                ...state,
                users: updateObjectInArray(state.users, action.userId, "id", { followed: false })
            };
        }
        case 'SN/USERS/SET_USERS': {
            return { ...state, users: action.users };
        }
        case 'SN/USERS/SET_CURRENT_PAGE': {
            return { ...state, currentPage: action.currentPage };
        }
        case 'SN/USERS/SET_TOTAL_USERS_COUNT': {
            return { ...state, totalUsersCount: action.totalCount };
        }
        case 'SN/USERS/TOGGLE_IS_FETCHING': {
            return { ...state, isFetching: action.isFetching };
        }
        case 'SN/USERS/TOGGLE_IS_FOLLOWING_PROGRESS': {
            return {
                ...state,
                followingInProgress: action.isFetching ?
                    [...state.followingInProgress, action.userId] : state.followingInProgress.filter(id => id !== action.userId)
            };
        }
        case 'SN/USERS/SET_FILTER': {
            return {
                ...state,
                filter: action.payload
            };
        }
        default:
            return state;
    }
}

export const actions = {
    followSuccess: (userId: number) => ({ type: 'SN/USERS/FOLLOW', userId } as const),
    unfollowSuccess: (userId: number) => ({ type: 'SN/USERS/UNFOLLOW', userId } as const),
    setUsers: (users: Array<UserType>) => ({ type: 'SN/USERS/SET_USERS', users } as const),
    setCurrentPage: (currentPage: number) => ({ type: 'SN/USERS/SET_CURRENT_PAGE', currentPage } as const),
    setTotalUsersCount: (totalCount: number) => ({ type: 'SN/USERS/SET_TOTAL_USERS_COUNT', totalCount } as const),
    setFilter: (filter: FilterType) => ({ type: 'SN/USERS/SET_FILTER', payload: filter } as const),
    toggleIsFetching: (isFetching: boolean) => ({ type: 'SN/USERS/TOGGLE_IS_FETCHING', isFetching } as const),
    toggleFollowingProgress: (isFetching: boolean, userId: number) => ({ type: 'SN/USERS/TOGGLE_IS_FOLLOWING_PROGRESS', isFetching, userId } as const)
}

type ThunkType = BaseThunkType<ActionTypes>

export const requestUsers = (pageSize: number, page: number, filter: FilterType): ThunkType => {
    return async (dispatch, getState) => {
        dispatch(actions.toggleIsFetching(true));
        dispatch(actions.setCurrentPage(page));
        dispatch(actions.setFilter(filter));
        let data = await usersAPI.getUsers(pageSize, page, filter.term, filter.friend);
        dispatch(actions.setCurrentPage(page));
        dispatch(actions.toggleIsFetching(false));
        dispatch(actions.setUsers(data.items));
        dispatch(actions.setTotalUsersCount(data.totalCount));
    }
};

const _followUnfollowFlow = async (dispatch: Dispatch<ActionTypes>, userId: number, apiMethod: any, actionCreator: (userId: number) => ActionTypes) => {
    dispatch(actions.toggleFollowingProgress(true, userId));
    let data = await apiMethod(userId);
    if (data.resultCode === 0) {
        dispatch(actionCreator(userId));
    }
    dispatch(actions.toggleFollowingProgress(false, userId));
}

export const follow = (userId: number): ThunkType => {
    return async (dispatch) => {
        _followUnfollowFlow(dispatch, userId, usersAPI.followUser.bind(usersAPI), actions.followSuccess);
    }
};

export const unfollow = (userId: number): ThunkType => {
    return async (dispatch) => {
        _followUnfollowFlow(dispatch, userId, usersAPI.unfollowUser.bind(usersAPI), actions.unfollowSuccess);
    }
};

export default usersReduser;