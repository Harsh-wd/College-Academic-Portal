import { apiCall } from '../api';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    postDone,
    doneSuccess
} from './teacherSlice.js';

export const getAllTeachers = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await apiCall('get', `/Teachers/${id}`);
        if (result.message) {
            dispatch(getFailed(result.message));
        } else {
            dispatch(getSuccess(result));
        }
    } catch (error) {
        dispatch(getError(error.message || 'An error occurred'));
    }
}

export const getTeacherDetails = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await apiCall('get', `/Teacher/${id}`);
        if (result) {
            dispatch(doneSuccess(result));
        }
    } catch (error) {
        dispatch(getError(error.message || 'An error occurred'));
    }
}

export const updateTeachSubject = (teacherId, teachSubject) => async (dispatch) => {
    dispatch(getRequest());
    try {
        await apiCall('put', `/TeacherSubject`, { teacherId, teachSubject });
        dispatch(postDone());
    } catch (error) {
        dispatch(getError(error.message || 'An error occurred'));
    }
}
