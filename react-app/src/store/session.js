import { setErrors } from "./errors"
// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";
const GET_USERS = 'session/GET_USERS';
const GET_SINGLE_USER = 'session/GET_SINGLE_USER';
const GET_SUGGESTED = 'session/GET_SUGGESTED';

const setUser = (user) => ({
    type: SET_USER,
    payload: user
})

const removeUser = () => ({
    type: REMOVE_USER
})

const getUsers = (users) => ({
    type: GET_USERS,
    payload: users
})

const getOneUser = (user) => ({
    type: GET_SINGLE_USER,
    payload: user
})

const getSuggestedUsers = (users) => ({
    type: GET_SUGGESTED,
    payload: users
})

// thunks
export const authenticate = () => async (dispatch) => {
    const response = await fetch('/api/auth/', {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    if (data.errors) {
        return;
    }
    dispatch(setUser(data))
}

export const demoLogin = () => async (dispatch) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: "demo@aa.io",
            password: "password"
        }),
    })
    const data = await response.json()
    dispatch(setUser(data));
    return response;

}
export const login = (email, password) => async (dispatch) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    const data = await response.json();
    if (data.errors) {
        return data;
    }
    dispatch(setUser(data));
    return {};
}

export const logout = () => async (dispatch) => {
    const response = await fetch("/api/auth/logout", {
        headers: {
            "Content-Type": "application/json",
        }
    });
    const data = await response.json();
    dispatch(removeUser());
};

export const signUp = (username, email, password, avatar_url) => async (dispatch) => {
    const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            email,
            password,
            avatar_url
        }),
    });
    const data = await response.json();
    if (!response.ok) {
        dispatch(setErrors(data.errors))
    } else {
        dispatch(setUser(data));
        //clear errors here dispatch(removeErrors())
    }
}

export const getAllUsers = () => async (dispatch) => {
    const res = await fetch('/api/users/', {
        method: 'GET'
    })
    const users = await res.json();
    dispatch(getUsers(users))
    return users
}

export const getSuggested = () => async (dispatch) => {
    const res = await fetch('/api/users/suggested')
    const users = await res.json();
    dispatch(getSuggestedUsers(users))
}

export const getSingleUser = (id) => async (dispatch) => {
    const res = await fetch(`/api/users/${id}`, {
        method: 'GET'
    })
    if (res.ok) {
        const user = await res.json();
        dispatch(getOneUser(user))
        return user
    }

}

export const followAUser = (follower_id) => async dispatch => {
    const response = await fetch(`/api/users/${follower_id}/follow`, {
        method: "POST"
    })
    const user = await response.json()
    return user
}

// reducer

const initialState = { user: null, users: null, target_user: null, suggested: null };

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return { user: action.payload };
        case REMOVE_USER:
            return { user: null };
        case GET_USERS:
            return { ...state, users: action.payload };
        case GET_SINGLE_USER:
            return { ...state, target_user: action.payload };
        case GET_SUGGESTED:
            const suggested = action.payload.users;
            const suggestedObj = {}
            for (const user of suggested){
                suggestedObj[user.id] = user;
            }
            return {...state, suggested: suggestedObj}
        default:
            return state;
    }
}
