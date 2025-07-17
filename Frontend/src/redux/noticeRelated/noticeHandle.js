import { apiCall } from '../api';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError
} from './noticeSlice.js';

export const getAllNotices = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await apiCall('get', `/${address}List/${id}`);
        if (result.message) {
            dispatch(getFailed(result.message));
        } else {
            dispatch(getSuccess(result));
        }
    } catch (error) {
        dispatch(getError(error.message || 'An error occurred'));
    }
}
