import axios from 'axios';

// Create an axios instance
const api = axios.create({
    baseURL: '/api', // This will be proxied by Vite during development
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * A generic function to make API calls.
 * @param {string} method - The HTTP method (get, post, put, delete).
 * @param {string} url - The URL to make the request to.
 * @param {object} [data] - The data to send with the request (for POST and PUT).
 * @param {object} [params] - The URL parameters to be sent with the request.
 * @returns {Promise<object>} - The response data from the API.
 */
export const apiCall = async (method, url, data = {}, params = {}) => {
    try {
        const response = await api({
            method,
            url,
            data,
            params,
        });
        return response.data;
    } catch (error) {
        // Rethrow the error to be caught by the calling function
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

/**
 * A helper function to create async thunks for Redux.
 * @param {string} type - The base type for the Redux actions.
 * @param {Function} apiFn - The API function to call.
 * @returns {Function} - An async thunk function.
 */
export const createAsyncThunk = (type, apiFn) => {
    const PENDING = `${type}/pending`;
    const FULFILLED = `${type}/fulfilled`;
    const REJECTED = `${type}/rejected`;

    return (args) => async (dispatch) => {
        dispatch({ type: PENDING });
        try {
            const response = await apiFn(args);
            dispatch({ type: FULFILLED, payload: response });
            return response;
        } catch (error) {
            dispatch({ type: REJECTED, payload: error.message || 'An error occurred' });
            throw error;
        }
    };
};
