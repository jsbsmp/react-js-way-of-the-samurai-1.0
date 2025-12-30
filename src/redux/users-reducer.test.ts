import usersReduser, { actions, requestUsers, follow, unfollow, UsersInitialType } from "./users-reducer"
import { UserType } from '../types/types';
import { usersAPI } from "../api/users-api";
import { ApiResponseType, ResultCodesEnum } from '../api/api';
import { AppStateType } from "./redux-store";

jest.mock("../api/users-api");
const usersAPIMock = usersAPI as jest.Mocked<typeof usersAPI>;

let state: UsersInitialType;
const dispatchMock = jest.fn();
const getStateMock = jest.fn();

beforeEach(() => {
    state = {
        users: [
            { id: 0, name: 'Dimych 0', followed: false, photos: { small: null, large: null }, status: 'status 0' },
            { id: 1, name: 'Dimych 1', followed: false, photos: { small: null, large: null }, status: 'status 1' },
            { id: 2, name: 'Dimych 2', followed: true, photos: { small: null, large: null }, status: 'status 2' },
            { id: 3, name: 'Dimych 3', followed: true, photos: { small: null, large: null }, status: 'status 3' },
        ],
        pageSize: 10,
        totalUsersCount: 0,
        currentPage: 1,
        isFetching: false,
        followingInProgress: [],
        filter: { term: '', friend: null }
    };

    dispatchMock.mockClear();
    getStateMock.mockClear();
    usersAPIMock.getUsers.mockClear();
    usersAPIMock.followUser.mockClear();
    usersAPIMock.unfollowUser.mockClear();
    getStateMock.mockReturnValue({ usersPage: state });
})

test("follow success", () => {
    const newState = usersReduser(state, actions.followSuccess(1))

    expect(newState.users[0].followed).toBeFalsy();
    expect(newState.users[1].followed).toBeTruthy();
})

test("unfollow success", () => {
    const newState = usersReduser(state, actions.unfollowSuccess(3))

    expect(newState.users[2].followed).toBeTruthy();
    expect(newState.users[3].followed).toBeFalsy();
})

test("setUsers", () => {
    const newUsers: Array<UserType> = [
        { id: 4, name: 'User 4', followed: false, photos: { small: null, large: null }, status: 'status 4' },
        { id: 5, name: 'User 5', followed: false, photos: { small: null, large: null }, status: 'status 5' }
    ];
    const newState = usersReduser(state, actions.setUsers(newUsers));

    expect(newState.users.length).toBe(2);
    expect(newState.users).toEqual(newUsers);
});

test("setCurrentPage", () => {
    const newState = usersReduser(state, actions.setCurrentPage(5));
    expect(newState.currentPage).toBe(5);
});

test("setTotalUsersCount", () => {
    const newState = usersReduser(state, actions.setTotalUsersCount(100));
    expect(newState.totalUsersCount).toBe(100);
});

test("toggleIsFetching", () => {
    const newState = usersReduser(state, actions.toggleIsFetching(true));
    expect(newState.isFetching).toBeTruthy();

    const newState2 = usersReduser(newState, actions.toggleIsFetching(false));
    expect(newState2.isFetching).toBeFalsy();
});

test("toggleFollowingProgress", () => {
    const newState = usersReduser(state, actions.toggleFollowingProgress(true, 1));
    expect(newState.followingInProgress).toContain(1);

    const newState2 = usersReduser(newState, actions.toggleFollowingProgress(false, 1));
    expect(newState2.followingInProgress).not.toContain(1);
});

test("thunk getRequestUsers", async () => {
    const thunk = requestUsers(1, 10, { term: '', friend: null });

    usersAPIMock.getUsers.mockReturnValue(Promise.resolve({
        items: [],
        totalCount: 2,
        error: null
    }));

    await thunk(dispatchMock, getStateMock, {});

    expect(dispatchMock).toHaveBeenNthCalledWith(1, actions.toggleIsFetching(true));
});

const result: ApiResponseType = {
    resultCode: ResultCodesEnum.Success,
    messages: [],
    data: {}
}

test("thunk follow", async () => {
    const thunk = follow(1);

    usersAPIMock.followUser.mockReturnValue(Promise.resolve(result));

    await thunk(dispatchMock, getStateMock, {});

    expect(dispatchMock.mock.calls.length).toBe(3);
    expect(dispatchMock).toHaveBeenNthCalledWith(1, actions.toggleFollowingProgress(true, 1));
    expect(dispatchMock).toHaveBeenNthCalledWith(2, actions.followSuccess(1));
    expect(dispatchMock).toHaveBeenNthCalledWith(3, actions.toggleFollowingProgress(false, 1));
});

test("thunk unfollow", async () => {
    const thunk = unfollow(1);

    usersAPIMock.unfollowUser.mockReturnValue(Promise.resolve(result));

    await thunk(dispatchMock, getStateMock, {});

    expect(dispatchMock.mock.calls.length).toBe(3);
    expect(dispatchMock).toHaveBeenNthCalledWith(1, actions.toggleFollowingProgress(true, 1));
    expect(dispatchMock).toHaveBeenNthCalledWith(2, actions.unfollowSuccess(1));
    expect(dispatchMock).toHaveBeenNthCalledWith(3, actions.toggleFollowingProgress(false, 1));
});
