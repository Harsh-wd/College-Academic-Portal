import { apiCall } from '../api';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    getStudentsSuccess,
    detailsSuccess,
    getFailedTwo,
    getSubjectsSuccess,
    getSubDetailsSuccess,
    getSubDetailsRequest
} from './sclassSlice.js';

export const getAllSclasses = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await apiCall('get', `/${address}List/${id}`);
        if (result.message) {
            dispatch(getFailedTwo(result.message));
        } else {
            dispatch(getSuccess(result));
        }
    } catch (error) {
        dispatch(getError(error.message || 'An error occurred'));
    }
}

export const getClassStudents = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await apiCall('get', `/Sclass/Students/${id}`);
        if (result.message) {
            dispatch(getFailedTwo(result.message));
        } else {
            dispatch(getStudentsSuccess(result));
        }
    } catch (error) {
        dispatch(getError(error.message || 'An error occurred'));
    }
}

export const getClassDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await apiCall('get', `/${address}/${id}`);
        if (result) {
            dispatch(detailsSuccess(result));
        }
    } catch (error) {
        dispatch(getError(error.message || 'An error occurred'));
    }
}

export const getSubjectList = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await apiCall('get', `/${address}/${id}`);
        if (result.message) {
            dispatch(getFailed(result.message));
        } else {
            dispatch(getSubjectsSuccess(result));
        }
    } catch (error) {
        dispatch(getError(error.message || 'An error occurred'));
    }
}

export const getTeacherFreeClassSubjects = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await apiCall('get', `/FreeSubjectList/${id}`);
        if (result.message) {
            dispatch(getFailed(result.message));
        } else {
            dispatch(getSubjectsSuccess(result));
        }
    } catch (error) {
        dispatch(getError(error.message || 'An error occurred'));
    }
}

export const getSubjectDetails = (id, address) => async (dispatch) => {
    dispatch(getSubDetailsRequest());
    try {
        const result = await apiCall('get', `/${address}/${id}`);
        if (result) {
            dispatch(getSubDetailsSuccess(result));
        }
    } catch (error) {
        dispatch(getError(error.message || 'An error occurred'));
    }
}
