import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { firestore, storage } from "../firebase";
import { toast } from 'react-toastify';
import firebase from './../firebase';

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async function (_, { rejectWithValue }) {

        const allUsers = [];

        try {
            await firestore.collection('users').get()
                .then((users) => users.docs.map((user) => {
                    if (user.exists) allUsers.push({ doc: user.id, user: user.data() });
                }))
                .catch((error) => rejectWithValue('Ошибка с сервера!'));

            return allUsers;
        } catch (error) {
            return rejectWithValue('Ошибка с сервера!')
        }
    }
)

export const addNewUser = createAsyncThunk(
    'users/addNewUser',
    async function (user, { rejectWithValue }) {

        const data = [];
        try {
            await firestore.collection('users').add({
                uid: user.uid,
                firstName: user.displayName,
                photoURL: user.photoURL,
                email: user.email,
                lastName: '',
                phone: '',
                about: '',
                following: [],
                followers: [],
                location: {
                    country: '',
                    city: '',
                    address: '',
                    pin: ''
                },
                socials: {
                    facebook: '',
                    twitter: '',
                    linkedIn: '',
                    instagram: '',
                    vk: '',
                    gitHub: '',
                    skype: '',
                    google: ''
                },
                chatUid: [],
                newMessage: [],
                stories: [],
                notifications: [],
                newNotification: false,
                isBlocked: [],
                chatUsers: []
            })
                .then((newPost) => newPost.get().then((post) => (
                    post.exists && data.push({ doc: post.id, user: post.data() })
                )))
                .catch((error) => toast.error('Не удалось добавить пользователя!'));
            return data[0];
        } catch (error) {
            return rejectWithValue('Не удалось добавить пользователя!');
        }
    }
)

export const getCurrentUser = createAsyncThunk(
    'users/getCurrentUser',
    async function (uid, { rejectWithValue }) {

        const currentUser = [];

        try {
            await firestore.collection('users').where('uid', '==', uid)
                .get().then((curUser) => curUser.docs.map(user => {
                    user.exists && currentUser.push({ doc: user.id, currentUser: user.data() })
                })).catch((error) => toast.error('Что-то пошло не так!'));

            return currentUser[0];
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const toggleSubscribe = createAsyncThunk(
    'users/toggleSubscribe',
    async function ({ userId, postId, method }, { rejectWithValue, getState, dispatch }) {

        const postUser = getState().users.users.find((user) => user.user.uid === postId);
        const currentUser = getState().users.users.find((user) => user.user.uid === userId);
        try {
            if (method === 'subscribe') {
                await firestore.collection('users').doc(postUser.doc)
                    .update({
                        followers: postUser.user.followers.concat({ uid: userId, photoURL: currentUser.user.photoURL, firstName: currentUser.user.firstName }),
                        notifications: postUser.user.notifications.concat({
                            message: 'подписался на вас',
                            photoURL: currentUser.user.photoURL,
                            firstName: currentUser.user.firstName,
                            uid: currentUser.user.uid,
                            createdAt: new Date().toDateString()
                        }),
                        newNotification: true
                    }).catch((error) => toast.error('не удалось подписаться!'));

                await firestore.collection('users').doc(currentUser.doc)
                    .update({
                        following: currentUser.user.following.concat({ uid: postId, photoURL: postUser.user.photoURL, firstName: postUser.user.firstName })
                    }).catch((error) => toast.error('не удалось подписаться!'));

                dispatch(toogleSubscriber({ cid: userId, pid: postId }))

            } else if (method === 'unsubscribe') {
                await firestore.collection('users').doc(postUser.doc)
                    .update({
                        followers: postUser.user.followers.filter((follow) => follow.uid !== userId)
                    }).catch((error) => toast.error('не удалось отписаться!'));

                await firestore.collection('users').doc(currentUser.doc)
                    .update({
                        following: currentUser.user.following.filter((follow) => follow.uid !== postId)
                    }).catch((error) => toast.error('не удалось отписаться!'));

                dispatch(toggleUnSubscriber({ cid: userId, pid: postId }))
            }

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const updatePhoto = createAsyncThunk(
    'users/updatePhoto',
    async function ({ user, photo }, { rejectWithValue, dispatch }) {
        try {
            let storageRef = storage.ref('profilePictures/' + user?.currentUser.uid + '.jpg');
            const uploadTask = storageRef.put(photo);

            uploadTask.on('state_changed', () => { },
                (error) => { },
                () => {
                    storageRef.getDownloadURL().then(async (url) => {
                        await firestore.collection('users').doc(user.doc)
                            .update({
                                photoURL: url
                            })
                        firebase.auth().currentUser.updateProfile({ photoURL: url })

                        dispatch(updateAvatar({ url }))
                    }).then(() => {
                        return toast.success('Успешно обновлено!')
                    })
                })
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const updateProfile = createAsyncThunk(
    'users/updateProfile',
    async function ({ doc, firstName, lastName, phone, about, photo }, { rejectWithValue, dispatch }) {
        try {
            await firestore.collection('users').doc(doc).update({
                firstName,
                lastName,
                phone,
                about
            }).then(() => {
                firebase.auth().currentUser.updateProfile({
                    displayName: firstName,
                })

                dispatch(updateProfileDate({ firstName, lastName, phone, about }));
                if (!photo.name) {
                    return toast.success("Успешно обновлено!")
                }
            })
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const updateAddress = createAsyncThunk(
    'users/updateAddress',
    async function ({ country, city, address, pin, doc }, { rejectWithValue, dispatch }) {
        try {
            await firestore.collection("users").doc(doc).update({
                location: {
                    country,
                    city,
                    address,
                    pin
                }
            }).then(() => {
                toast.success("Успешно обновлено!");
            })
            dispatch(updateAddressDate({ country, city, address, pin }));

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const updateSocial = createAsyncThunk(
    'users/updateSocialData',
    async function ({ facebook, twitter, linkedIn, instagram, vk, github, skype, google, doc }, { rejectWithValue, dispatch }) {
        try {
            await firestore.collection("users").doc(doc).update({
                socials: {
                    facebook, twitter, linkedIn, instagram, vk, github,
                    skype, google
                }
            }).then(() => toast.success("Успешно обновлено!"))
                .catch((error) => toast.error(error.message));
            dispatch(updateSocialDate({ facebook, twitter, linkedIn, instagram, vk, github, skype, google }));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const updateChatUsers = createAsyncThunk(
    'users/updateChatUsers',
    async function ({ currentUser, getterUser }, { rejectWithValue, dispatch }) {
        try {
            firestore.collection('users').doc(currentUser.doc).get()
                .then((data) => {
                    if (data.data().chatUsers.length === 0 ||
                        data.data().chatUsers.some((chatUser) => chatUser.uid !== getterUser.user.uid)) {
                        firestore.collection('users').doc(currentUser.doc).update({
                            chatUsers: getterUser.user.chatUsers.concat({
                                photoURL: getterUser.user.photoURL,
                                firstName: getterUser.user.firstName,
                                uid: getterUser.user.uid
                            })
                        });
                        firestore.collection('users').doc(getterUser.doc).update({
                            chatUsers: currentUser.currentUser.chatUsers.concat({
                                photoURL: currentUser.currentUser.photoURL,
                                firstName: currentUser.currentUser.firstName,
                                uid: currentUser.currentUser.uid
                            })
                        });

                        dispatch(updateChatUsersDate({ getterUid: getterUser.user.uid }))
                    }

                    firestore.collection('users').doc(getterUser.doc).update({
                        newMessage: getterUser.user.newMessage.concat(
                            currentUser.currentUser.uid
                        )
                    }).then(() => {
                        dispatch(gotNewMessage({ getterUid: getterUser.user.uid }));
                    })
                })
        } catch (error) {
            return rejectWithValue(error.message);
        }

    }
)

export const updateNotificationMessage = createAsyncThunk(
    'users/updateNotificationMessage',
    async function ({ currentUser, uid }, { rejectWithValue, dispatch }) {
        try {
            firestore.collection('users').doc(currentUser.doc)
                .update({
                    newMessage: currentUser.currentUser.newMessage.filter((mess) => mess !== uid)
                }).then(() => {
                    dispatch(deleteNewMessage({ uid }))
                })
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const deleteNotifications = createAsyncThunk(
    'users/deleteNotification',
    async function (currentUser, { rejectWithValue, dispatch }) {
        try {
            firestore.collection('users').doc(currentUser.doc)
                .update({
                    notifications: []
                }).then(() => dispatch(removeNotification()))
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const updateNotification = createAsyncThunk(
    'users/updateNotification',
    async function (currentUser, { rejectWithValue, dispatch }) {
        try {
            firestore.collection('users').doc(currentUser.doc)
                .update({
                    newNotification: false
                }).then(() => dispatch(changeNotification()))
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const blockUser = createAsyncThunk(
    'users/blockUser',
    async function ({ currentUser, getterUser }, { rejectWithValue, dispatch }) {
        try {
            firestore.collection('users').doc(currentUser.doc)
                .update({
                    isBlocked: currentUser.currentUser.isBlocked
                        .concat({ uid: getterUser.user.uid })
                })
            firestore.collection('users').doc(getterUser.doc)
                .update({
                    isBlocked: getterUser.user.isBlocked
                        .concat({ uid: currentUser.currentUser.uid })
                })
            dispatch(blockedUser({ uid: getterUser.user.uid }));

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)


// addStory
// export const addStory = createAsyncThunk(
//     'stories/addStory',
//     async function ({ currentUser, URLs }, { rejectWithValue }) {
//         try {
//             for (let i = 0; i < URLs.length; i++) {
//                 firestore.collection('allStories').doc(currentUser.currentUser.firstName)
//                     .update({
//                         photoURL: currentUser.currentUser.photoURL,
//                         firstName: currentUser.currentUser.firstName,
//                         story: URLs[i],
//                         uid: currentUser.currentUser.uid,
//                         createdAt: firebase.firestore.FieldValue.serverTimestamp()
//                     })
//             }

//         } catch (error) {
//             return rejectWithValue(error.message);
//         }
//     }
// )
//addStory

const initialState = {
    status: '',
    error: null,
    users: [],
    currentUser: null
}

const setError = (state, action) => {
    state.status = 'rejected';
    state.error = action.payload
}
const setPending = (state, action) => {
    state.status = 'loading';
    state.error = null;
}
const setSuccess = (state, action) => {
    state.status = 'success';
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        toogleSubscriber(state, action) {
            const currentUser = state.users.find(user => user.user.uid === action.payload.cid)
            const postUser = state.users.find(user => user.user.uid === action.payload.pid)
            currentUser.user.following = currentUser.user.following.concat({ uid: action.payload.pid, photoURL: postUser.user.photoURL, firstName: postUser.user.firstName })
            postUser.user.followers = postUser.user.followers.concat({ uid: action.payload.cid, photoURL: currentUser.user.photoURL, firstName: currentUser.user.firstName })
            postUser.user.notifications = postUser.user.notifications.concat({
                message: 'подписался на вас',
                photoURL: currentUser.user.photoURL,
                firstName: currentUser.user.firstName,
                uid: currentUser.user.uid,
                createdAt: new Date().toDateString()
            });
            postUser.user.newNotification = true;
        },
        toggleUnSubscriber(state, action) {
            const currentUser = state.users.find(user => user.user.uid === action.payload.cid)
            const postUser = state.users.find(user => user.user.uid === action.payload.pid)
            currentUser.user.following = currentUser.user.following.filter(follow => follow.uid !== action.payload.pid)
            postUser.user.followers = postUser.user.followers.filter(follow => follow.uid !== action.payload.cid)
        },
        updateAvatar(state, action) {
            state.currentUser.currentUser.photoURL = action.payload.url
        },
        updateProfileDate(state, action) {
            const user = state.users.find(({ user }) => user.uid == state.currentUser.currentUser.uid);
            user.user.firstName = action.payload.firstName
            user.user.lastName = action.payload.lastName
            user.user.phone = action.payload.phone
            user.user.about = action.payload.about
        },
        updateAddressDate(state, action) {
            state.currentUser.currentUser.location.country = action.payload.country;
            state.currentUser.currentUser.location.city = action.payload.city;
            state.currentUser.currentUser.location.address = action.payload.address;
            state.currentUser.currentUser.location.pin = action.payload.pin;
        },
        updateSocialDate(state, action) {
            state.currentUser.currentUser.socials.facebook = action.payload.facebook;
            state.currentUser.currentUser.socials.twitter = action.payload.twitter;
            state.currentUser.currentUser.socials.linkedIn = action.payload.linkedIn;
            state.currentUser.currentUser.socials.instagram = action.payload.instagram;
            state.currentUser.currentUser.socials.vk = action.payload.vk;
            state.currentUser.currentUser.socials.github = action.payload.github;
            state.currentUser.currentUser.socials.skype = action.payload.skype;
            state.currentUser.currentUser.socials.google = action.payload.google;
        },
        updateChatUsersDate(state, action) {
            const getterUser = state.users.find(({ user }) => user.uid === action.payload.getterUid);
            state.currentUser.currentUser.chatUsers = getterUser?.user.chatUsers.concat({
                photoURL: getterUser?.user.photoURL,
                firstName: getterUser?.user.firstName,
                uid: getterUser?.user.uid
            });
            getterUser.user.chatUsers = state.currentUser?.currentUser.chatUsers.concat({
                photoURL: state.currentUser?.currentUser.photoURL,
                firstName: state.currentUser?.currentUser.firstName,
                uid: state.currentUser?.currentUser.uid
            });
        },
        gotNewMessage(state, action) {
            const getterUser = state.users.find(({ user }) => user.uid === action.payload.getterUid);
            getterUser.user.newMessage = getterUser.user.newMessage.concat(state.currentUser.currentUser.uid);
        },
        deleteNewMessage(state, action) {
            state.currentUser.currentUser.newMessage = state.currentUser.currentUser.newMessage.filter((mess) => mess !== action.payload.uid)
        },
        removeNotification(state, action) {
            state.currentUser.currentUser.notifications = [];
        },
        changeNotification(state, action) {
            state.currentUser.currentUser.newNotification = false;
        },
        blockedUser(state, action) {
            const getterUser = state.users.find(({ user }) => user.uid === action.payload.uid);
            state.currentUser.currentUser.isBlocked = state.currentUser.currentUser.isBlocked.concat({ uid: getterUser.user.uid });
            getterUser.user.isBlocked = getterUser.user.isBlocked.concat({ uid: state.currentUser.currentUser.uid });
        }
    },
    extraReducers: {
        [fetchUsers.pending]: setPending,
        [addNewUser.pending]: setPending,
        [updatePhoto.pending]: setPending,
        [updateProfile.pending]: setPending,
        [updateAddress.pending]: setPending,
        [updateSocial.pending]: setPending,
        [deleteNotifications.pending]: setPending,
        // [addStory.pending]: setPending,
        [fetchUsers.fulfilled]: (state, action) => {
            state.status = 'success';
            state.users = action.payload
        },
        [addNewUser.fulfilled]: (state, action) => {
            state.users.unshift(action.payload);
        },
        [getCurrentUser.fulfilled]: (state, action) => {
            state.currentUser = action.payload
        },
        [updatePhoto.fulfilled]: setSuccess,
        [updateProfile.fulfilled]: setSuccess,
        [updateAddress.fulfilled]: setSuccess,
        [updateSocial.fulfilled]: setSuccess,
        // [addStory.fulfilled]: setSuccess,
        [fetchUsers.rejected]: setError,
        [addNewUser.rejected]: setError,
        [getCurrentUser.rejected]: setError,
        [updatePhoto.rejected]: setError,
        [updateProfile.rejected]: setError,
        [updateAddress.rejected]: setError,
        [updateSocial.rejected]: setError,
        [updateChatUsers.rejected]: setError,
        [updateNotificationMessage.rejected]: setError,
        [deleteNotifications.rejected]: setError,
        [updateNotification.rejected]: setError,
        [blockUser.rejected]: setError
        // [addStory.rejected]: setError,
    }

})

const { toogleSubscriber, toggleUnSubscriber, updateAvatar, updateProfileDate, updateAddressDate, updateSocialDate, updateChatUsersDate, gotNewMessage, deleteNewMessage, removeNotification, changeNotification, blockedUser } = userSlice.actions;

export default userSlice.reducer;