import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firebase, { firestore } from './../firebase';


export const fetchStories = createAsyncThunk(
    'stories/fetchStories',
    async function (_, { rejectWithValue }) {
        try {

            const allStories = [];
            await firestore.collection('allStories')
                .orderBy('createdAt', 'desc').get()
                .then((stories) => stories.docs.map((story) => {
                    if (story.exists) allStories.push({ doc: story.id, story: story.data() });
                }))

            return allStories;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)


export const addStory = createAsyncThunk(
    'stories/addStory',
    async function ({ currentUser, URLs }, { rejectWithValue }) {
        try {

            const data = [];
            for (let i = 0; i < URLs.length; i++) {
                await firestore.collection('allStories').add({
                    photoURL: currentUser.currentUser.photoURL,
                    firstName: currentUser.currentUser.firstName,
                    story: URLs[i],
                    uid: currentUser.currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then((newStory) => newStory.get().then((story) => (
                    data.push({ doc: story.id, story: story.data() })
                )))
            }

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const initialState = {
    status: '',
    error: null,
    stories: []
}

const storySlice = createSlice({
    name: 'stories',
    initialState,
    reducers: {
    },
    extraReducers: {
        [fetchStories.pending]: (state, action) => {
            state.status = "loading";
            state.error = null
        },
        [addStory.pending]: (state, action) => {
            state.status = "loading";
            state.error = null
        },
        [fetchStories.fulfilled]: (state, action) => {
            state.status = "success";
            state.stories = action.payload;
        },
        [addStory.fulfilled]: (state, action) => {
            state.status = "success";
            state.stories = state.stories.concat(action.payload);
        },
        [fetchStories.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        },
        [addStory.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        },
    }
})

const { } = storySlice.actions;

export default storySlice.reducer;