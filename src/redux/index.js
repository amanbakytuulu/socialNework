import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import postReducer from "./postSlice";
import storyReducer from "./storySlice";


export default configureStore({
    reducer: {
        users: userReducer,
        posts: postReducer,
        stories: storyReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})