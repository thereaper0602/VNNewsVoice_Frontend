import React from 'react';

export const USER_ACTIONS = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    UPDATE_PROFILE: 'UPDATE_PROFILE'
};

export const initialUserState = {
    user: null,
    isAuthenticated: false,
    token: null
};

export const userReducer = (state, action) => {
    switch (action.type) {
        case USER_ACTIONS.LOGIN:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true
            };
        case USER_ACTIONS.LOGOUT:
            return {
                ...initialUserState
            };
        case USER_ACTIONS.UPDATE_PROFILE:
            return {
                ...state,
                user: { ...state.user, ...action.payload }
            };
        default:
            return state;
    }
};