import { apiCall } from '../api';
import {
    authRequest,
    stuffAdded,
    authSuccess,
    authFailed,
    authError,
    authLogout,
    doneSuccess,
    getDeleteSuccess,
    getRequest,
    getFailed,
    getError,
} from './userSlice.js';

export const loginUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());
    try {
        const result = await apiCall('post', `/${role}Login`, fields);
        if (result.role) {
            dispatch(authSuccess(result));
        } else {
            dispatch(authFailed(result.message));
        }
    } catch (error) {
        dispatch(authError(error.message || 'An error occurred'));
    }
};

export const registerUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());
    try {
        const result = await apiCall('post', `/${role}Reg`, fields);
        if (result.schoolName) {
            dispatch(authSuccess(result));
        }
        else if (result.school) {
            dispatch(stuffAdded(result));
        }
        else {
            dispatch(authFailed(result.message));
        }
    } catch (error) {
        dispatch(authError(error.message || 'An error occurred'));
    }
};

export const logoutUser = () => (dispatch) => {
    dispatch(authLogout());
};

export const getUserDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await apiCall('get', `/${address}/${id}`);
        if (result) {
            dispatch(doneSuccess(result));
        }
    } catch (error) {
        dispatch(getError(error.message || 'An error occurred'));
    }
}

export const deleteUser = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await apiCall('delete', `/${address}/${id}`);
        if (result.message) {
            dispatch(getFailed(result.message));
        } else {
            dispatch(getDeleteSuccess());
        }
    } catch (error) {
        dispatch(getError(error.message || 'An error occurred'));
    }
}

export const updateUser = (fields, id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await apiCall('put', `/${address}/${id}`, fields);
        if (result.schoolName) {
            dispatch(authSuccess(result));
        }
        else {
            dispatch(doneSuccess(result));
        }
    } catch (error) {
        dispatch(getError(error.message || 'An error occurred'));
    }
}

export const addStuff = (fields, address) => async (dispatch) => {
    dispatch(authRequest());
    try {
        const result = await apiCall('post', `/${address}Create`, fields);
        if (result.message) {
            dispatch(authFailed(result.message));
        } else {
            dispatch(stuffAdded(result));
        }
    } catch (error) {
        dispatch(authError(error.message || 'An error occurred'));
    }
};
