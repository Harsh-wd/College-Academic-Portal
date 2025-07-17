import { apiCall } from '../api';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    stuffDone
} from './studentSlice.js';

export const getAllStudents = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await apiCall('get', `/Students/${id}`);
        if (result.message) {
            dispatch(getFailed(result.message));
        } else {
            dispatch(getSuccess(result));
        }
    } catch (error) {
        dispatch(getError(error.message || 'An error occurred'));
    }
}

export const updateStudentFields = (id, fields, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await apiCall('put', `/${address}/${id}`, fields);
        if (result.message) {
            dispatch(getFailed(result.message));
        } else {
            dispatch(stuffDone());
        }
    } catch (error) {
        dispatch(getError(error.message || 'An error occurred'));
    }
}

export const removeStuff = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await apiCall('put', `/${address}/${id}`);
        if (result.message) {
            dispatch(getFailed(result.message));
        } else {
            dispatch(stuffDone());
        }
    } catch (error) {
        dispatch(getError(error.message || 'An error occurred'));
    }
}
