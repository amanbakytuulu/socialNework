import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firestore } from '../firebase';
import firebase from './../firebase';
import { toast } from 'react-toastify';

export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async function (_, { rejectWithValue }) {

        const allPosts = [];

        try {
            await firestore.collection("posts").orderBy("createdAt", "desc").get()
                .then((posts) => posts.docs.map((post) => {
                    if (post.exists) allPosts.push({ doc: post.id, post: post.data() });
                }))
                .catch((error) => rejectWithValue('Проблемы со сервером!'));

            return allPosts;
        } catch (error) {
            return rejectWithValue('Проблемы со сервером!');
        }
    }
)

export const addNewPost = createAsyncThunk(
    'posts/addNewPost',
    async function ({ user, URLs, value }, { rejectWithValue }) {

        const data = [];

        try {
            await firestore.collection('posts').add({
                uid: user.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                text: value,
                img: URLs,
                comments: [],
                likes: []
            })
                .then((newPost) => newPost.get().then((post) => (
                    data.push({ doc: post.id, post: post.data() })
                )))
                .catch((error) => toast.error('Что то не так!'))

            return data[0];
        } catch (error) {
            return rejectWithValue('Что то не так!');
        }
    }

)

export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async function (doc, { rejectWithValue, dispatch }) {
        try {
            await firestore.collection('posts').doc(doc).delete()
                .then(() => toast.success('Успешно удалено!'))
                .catch((error) => toast.error('Не удалось удалить!'));

            dispatch(removePost({ doc }));
        } catch (error) {
            return rejectWithValue('Что-то пошло не так!')
        }
    }
)

export const editPost = createAsyncThunk(
    'posts/editPost',
    async function ({ text, doc }, { rejectWithValue, dispatch }) {
        try {
            await firestore.collection('posts').doc(doc)
                .update({
                    text
                }).then(() => toast.success('Пост обновлен!'))
                .catch((error) => toast.error('Что-то пошло не так!'));

            dispatch(changePost({ text, doc }));

        } catch (error) {
            return rejectWithValue(error.message);
        }

    }
)

export const updateLike = createAsyncThunk(
    'posts/updateLike',
    async function ({ doc, like }, { rejectWithValue, dispatch }) {
        try {
            await firestore.collection('posts').doc(doc).update({
                likes: like
            });

            dispatch(changeLike({ doc, like }));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)
const initialState = {
    status: '',
    error: null,
    posts: []
}

const setError = (state, action) => {
    state.status = 'rejected';
    state.error = action.payload;
}

const setStatus = (state, action) => {
    state.status = 'loading';
    state.error = null;
}

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        removePost(state, action) {
            state.posts = state.posts.filter(post => post.doc !== action.payload.doc)
        },
        changePost(state, action) {
            const currentPost = state.posts.find((post) => post.doc === action.payload.doc);
            currentPost.post.text = action.payload.text;
        },
        changeLike(state, action) {
            const post = state.posts.find((post) => post.doc === action.payload.doc);
            post.post.likes = action.payload.like;
        }
    },
    extraReducers: {
        [fetchPosts.pending]: setStatus,
        [addNewPost.pending]: setStatus,
        [editPost.pending]: setStatus,
        [fetchPosts.fulfilled]: (state, action) => {
            state.status = 'success';
            state.posts = action.payload;
        },
        [addNewPost.fulfilled]: (state, action) => {
            state.status = 'success';
            state.posts.unshift(action.payload);
        },
        [editPost.fulfilled]: (state, action) => {
            state.status = 'success'
        },
        [fetchPosts.rejected]: setError,
        [addNewPost.rejected]: setError,
        [deletePost.rejected]: setError,
        [editPost.rejected]: setError,
        [updateLike.rejected]: setError
    }
})


const { changeLike, changePost, removePost } = postSlice.actions;

export default postSlice.reducer;

