import profileReducer, { actions } from "./profile-reducer";

let state = {
    posts: [
        { id: 1, message: "Hello, world!", likesCount: '10' },
        { id: 2, message: "It`s my first post", likesCount: '5' }
    ],
    profile: null,
    status: "",
    newPostText: ""
};

test('length of posts should be incremented', () => {
    let newState = profileReducer(state, actions.addPostActionCreator("it-kamasutra.com"));
    expect(newState.posts.length).toBe(3);
});

test('message of new post should be correct', () => {
    let newState = profileReducer(state, actions.addPostActionCreator("it-kamasutra.com"));
    expect(newState.posts[2].message).toBe("it-kamasutra.com");
});

test('length of posts should be decremented', () => {
    let newState = profileReducer(state, actions.deletePostActionCreator(1));
    expect(newState.posts.length).toBe(1);
});