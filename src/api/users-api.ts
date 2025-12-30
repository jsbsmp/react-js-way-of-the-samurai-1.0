import { GetUsersResponseType, instance, ApiResponseType } from "./api";

export const usersAPI = {
    getUsers: (pageSize = 10, currentPage = 1, term = '', friend: null | boolean = null) => {
        return instance.get<GetUsersResponseType>(`users?count=${pageSize}&page=${currentPage}&term=${term}` + (friend !== null ? `&friend=${friend}` : ''))
            .then(response => {
                return response.data;
            });
    },

    followUser: (userId: number) => {
        return instance.post<ApiResponseType>(`follow/${userId}`)
            .then(response => {
                return response.data;
            });
    },

    unfollowUser: (userId: number) => {
        return instance.delete(`follow/${userId}`)
            .then(response => {
                return response.data;
            }) as Promise<ApiResponseType>;
    }
}
