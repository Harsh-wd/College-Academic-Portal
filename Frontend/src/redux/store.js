import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './userRelated/userSlice.js';
import { studentReducer } from './studentRelated/studentSlice.js';
import { noticeReducer } from './noticeRelated/noticeSlice.js';
import { sclassReducer } from './sclassRelated/sclassSlice.js';
import { teacherReducer } from './teacherRelated/teacherSlice.js';


const store = configureStore({
    reducer: {
        user: userReducer,
        student: studentReducer,
        teacher: teacherReducer,
        notice: noticeReducer,
        sclass: sclassReducer
    },
});

export default store;
