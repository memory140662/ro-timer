import * as types from './types'
import moment from 'moment-timezone'
import cookie from 'react-cookies'
import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import Service from './service'
import { asyncFulfilled, asyncRejected, asyncPending } from './utils'

import {
    COOKIE_NAME_BOSS_TIME,
} from './constants'

const initState = {
    data: [],
    currentBoss: null,
    randomBoss: null,
    user: null,
    isLoading: false,
    localData: null,
    isAuthChanging: false,
    isCreateDialogVisible: false,
    error: null,
    applyResult: null,
    isApplyLoading: false,
    members: [],
    isMemberLoading: false,
    memberStatus: undefined,
    isMemberStatusChecking: false,
    maxRandomNum: 0,
    isConfigLoading: false,
}

const createHandler = (state, payload) => {
    const key = Date.now() + state.data.length
    const newBoss = Service.createBoss({
        ...payload,
        idx: key,
        key: key ,
    })
    return update(state, { 
        data: { $push: [ newBoss ] }, 
    })
}

const createBossHandler = (state, payload) => {
    if (state.data.findIndex(boss => boss.key === payload.key) !== -1) {
        return update(state, { 
            isLoading: { $set: false },
        })
    }

    return update(state, { 
        data: { $push: [ payload ] }, 
        isLoading: { $set: false },
    })
}

const editHandler = (state, key) => {
    return {
        ...state, 
        currentBoss: state.data.find(boss => boss.key === key),
    }
}

const editCancelHandler = state => {
    return update(state, {currentBoss: {$set: null}})
}

const updateBossHandler = (state, payload) => {
    const data = [...state.data]
    const boss = data.find(({ key }) => key === payload.key)
    Object.assign(boss, payload)
    return update(state, { 
        data: { $set: data },
        currentBoss: { $set: null },
        isLoading: { $set: false },
    })
}

const saveHandler = state => {
    cookie.save(COOKIE_NAME_BOSS_TIME, state.data, { 
        path: '/',
        expires: moment().add(1, 'year').toDate(),
        secure: process.env.NODE_ENV !== 'development',
    })
    return state
}

const deleteBossHandler = (state, key) => {
    const data = [...state.data.filter(data => data.key !== key)]
    return update(state, {
        data: { $set: data },
        isLoading: { $set: false },
    })
}

const getAllBossHandler = (state, payload, error) => {
    if (error) {
        return update(state, {
            isLoading: {$set: false},
        })
    }

    return update(state, {
        data: {$set: payload},
        isLoading: {$set: false},
    })
}

const startLoadingHandler = (state) => {
    return update(state, {isLoading: {$set: true}})
}

const loadHandler = (state) => {
    const data = cookie.load(COOKIE_NAME_BOSS_TIME) || []
    return update(state, { 
        data: { $set: data },
        isLoading: { $set: false },
    })
}

const setUserHandler = (state, payload) => {
    return update(state, {user: {$set: payload}})
}

const setRandomTime = (state, payload) => {
    const index = state.data.findIndex(boss => boss.key === payload.key)
    if (index === -1) {
        return state
    }
    const boss = state.data[index]
    const newBoss = Service.setBossRandomTime(boss, payload.num)
    return update(state, {
        data: { $splice: [[index, 1, newBoss]] },
    })
}

const updateHandler = (state, payload) => {
    const index = state.data.findIndex(boss => boss.key === payload.key)
    if (index === -1) {
        return state
    }
    const boss = state.data[index]
    const newBoss = Service.updateBoss(boss, payload)
    return update(state, {
        data: { $splice: [[index, 1, newBoss]] },
        currentBoss: { $set: null },
    })
}

const killHandler = (state, key) => {
    const index = state.data.findIndex(boss => boss.key === key)
    if (index === -1) {
        return state
    }
    const boss = state.data[index]
    const newBoss = Service.killBoss(boss)
    return update(state, {
        data: { $splice: [[index, 1, newBoss]] },
    })
}

const checkLocalHandler = (state) => {
    const data = cookie.load(COOKIE_NAME_BOSS_TIME)
    if (data && data.length > 0) {
        return update(state, {
            localData: { $set: data },
        })
    }

    return state
}

const upload2CloudHandler = (state, payload) => {
    cookie.remove(COOKIE_NAME_BOSS_TIME)
    return update(state, {
        data: { $set: payload },
        isLoading: { $set: false },
        localData: { $set: null },
    })
}

const deleteLocalDataHandler = (state) => {
    cookie.remove(COOKIE_NAME_BOSS_TIME)
    return update(state, {
        localData: { $set: null },
    })
}

const setAuthChangingHandler = (state, payload) => {
    return update(state, {
        isAuthChanging: { $set: payload },
    })
}

const pendingHandler = (state) => {
    return update(state, {
        isLoading: { $set: true },
        error: { $set: null },
    })
}

const rejectedHandler = (state, payload) => {
    return update(state, {
        isLoading: { $set: false },
        error: { $set: payload.message },
    })
}

const receiveBossChangedHandler = (state, payload) => {
    const index = state.data.findIndex(boss => boss.key === payload.key)
    if (index === -1) {
        return state
    }

    return update(state, {
        data: { $splice: [[index, 1, payload]] },
    })
}

const receiveBossAddedHandler = (state, payload) => {
    if (state.data.findIndex(boss => boss.key === payload.key) !== -1) {
        return state
    }

    return update(state, {
        data: { $push: [ payload ] },
    })
}

const receiveBossRemovedHandler = (state, payload) => {
    const index = state.data.findIndex(boss => boss.key === payload.key)
    if (index === -1) {
        return state
    }

    return update(state, {
        data: { $splice: [[index, 1]] },
    })
}

const setRandomBossHandler = (state, payload) => {

    return update(state, {
        randomBoss: { $set: payload },
    })
}

const setCreateDialogVisibleHandler = (state, payload) => {
    return update(state, {
        isCreateDialogVisible: { $set: payload },
    })
}

const applyMemberPendingHandler = (state) => {
    return update(state, {
        isApplyLoading: { $set: true },
        applyResult: { $set: null },
    })
}

const applyMemberHandler = (state, payload, error) => {
    if (error) {
        return update(state, {
            isApplyLoading: { $set: false },
            applyResult: { $set: error },
        })
    }

    return update(state, {
        isApplyLoading: { $set: false },
        applyResult: { $set: payload },
    })
}

const getMemberHandler = (state, payload, error) => {
    if (!payload && !error) {
        return update(state, {
            isMemberLoading: { $set: true },
        })
    }
    if (error) {
        return update(state, {
            isMemberLoading: { $set: false },
            error: { $set: error },
        })
    }

    return update(state, {
        isMemberLoading: { $set: false },
        members: { $set: payload },
    })
}

const checkMemberStatusPendingHandler = (state) => {
    return update(state, {
        isMemberStatusChecking: { $set: true },
    })
}

const checkMemberStatusHandler = (state, payload, error) => {
    if (error) {
        return update(state, {
            error: { $set: error },
            isMemberStatusChecking: { $set: false },
        })
    }

    return setMemberStatusHandler(state, payload)
}

const setMemberStatusHandler = (state, payload) => {
    return update(state, {
        memberStatus: { $set: payload },
        isMemberStatusChecking: { $set: false },
    })
}

const updateMemberStatusHandler = (state, payload, error) => {
    if (!error && !payload) {
        return update(state, {
            isMemberLoading: { $set: true },
        })
    }

    if (error) {
        return update(state, {
            error: { $set: error },
            isMemberLoading: { $set: false },
        })
    }

    const idx = state.members.findIndex(member => member.uid === payload.uid)
    return update(state, {
        members: { $splice: [[idx, 1, payload]] },
        isMemberLoading: { $set: false },
    })
}

const removeMemberHandler = (state, payload, error) => {
    if (!error && !payload) {
        return update(state, {
            isMemberLoading: { $set: true },
        })
    }

    if (error) {
        return update(state, {
            error: { $set: error },
            isMemberLoading: { $set: false },
        })
    }

    const idx = state.members.findIndex(member => member.uid === payload)
    return update(state, {
        members: { $splice: [[idx, 1]] },
        isMemberLoading: { $set: false },
    })
}

const receiveMemberApplyHandler = (state, payload) => {
    const idx = state.members.findIndex(member => member.uid === payload.uid)
    if (idx !== -1) {
        return state
    }

    return update(state, {
        members: { $push: [payload] },
    })
}

const loadRemoteConfigPendingHandler = (state) => {
    return update(state, {
        isConfigLoading: { $set: true },
    })
}

const loadRemoteConfigHandler = (state, payload) => {
    return {
        ...state,
        ...payload,
        isConfigLoading: false,
    }
}

export default handleActions({
    [types.TYPE_CREATE]: (state, { payload }) => createHandler(state, payload),
    [types.TYPE_LOAD_DATA]: (state) => loadHandler(state),
    [types.TYPE_KILL]: (state, { payload }) => killHandler(state, payload),
    [types.TYPE_SET_RANDOM_TIME]: (state, { payload }) => setRandomTime(state, payload),
    [types.TYPE_EDIT]: (state, { payload }) => editHandler(state, payload),
    [types.TYPE_EDIT_CANCEL]: state => editCancelHandler(state),
    [types.TYPE_UPDATE]: (state, { payload }) => updateHandler(state, payload),
    [types.TYPE_SAVE_DATA]: state => saveHandler(state),
    [types.TYPE_DELETE]: (state, { payload }) => deleteBossHandler(state, payload),
    [types.TYPE_SET_USER]: (state, { payload }) => setUserHandler(state, payload),
    [types.TYPE_START_LOADING]: state => startLoadingHandler(state),
    [types.TYPE_CHECK_LOCAL]: state => checkLocalHandler(state),
    [types.TYPE_DELETE_LOCAL_DATA]: (state) => deleteLocalDataHandler(state),
    [types.TYPE_SET_AUTH_CHANGING]: (state, { payload }) => setAuthChangingHandler(state, payload),
    [types.TYPE_RECEIVE_BOSS_CHANGED]: (state, { payload }) => receiveBossChangedHandler(state, payload),
    [types.TYPE_RECEIVE_BOSS_ADDED]: (state, { payload }) => receiveBossAddedHandler(state, payload),
    [types.TYPE_RECEIVE_BOSS_REMOVED]: (state, { payload }) => receiveBossRemovedHandler(state, payload),
    [types.TYPE_SET_RANDOM_BOSS]: (state, { payload }) => setRandomBossHandler(state, payload),
    [types.TYPE_SET_CREATE_DIALOG_VISIBLE]: (state, { payload }) => setCreateDialogVisibleHandler(state, payload),
    [types.TYPE_SET_MEMBER_STATUS]: (state, { payload }) => setMemberStatusHandler(state, payload),
    [types.TYPE_RECEIVE_MEMBER_APPLY]: (state, { payload }) => receiveMemberApplyHandler(state, payload),
    // pending
    [asyncPending(types.TYPE_SIGN_IN_USER)]: (state) => pendingHandler(state),
    [asyncPending(types.TYPE_SIGN_OUT_USER)]: (state) => pendingHandler(state),
    [asyncPending(types.TYPE_GET_ALL_BOSS)]: (state) => pendingHandler(state),
    [asyncPending(types.TYPE_CREATE_BOSS)]: (state) => pendingHandler(state),
    [asyncPending(types.TYPE_KILL_BOSS)]: (state) => pendingHandler(state),
    [asyncPending(types.TYPE_UPDATE_BOSS)]: (state) => pendingHandler(state),
    [asyncPending(types.TYPE_SET_BOSS_RANDOM_TIME)]: (state) => pendingHandler(state),
    [asyncPending(types.TYPE_UPLOAD_LOCAL_TO_CLOUD)]: (state) => pendingHandler(state),
    [asyncPending(types.TYPE_DELETE_BOSS)]: (state) => pendingHandler(state),
    [asyncPending(types.TYPE_APPLY_MEMBER)]: (state) => applyMemberPendingHandler(state),
    [asyncPending(types.TYPE_GET_MEMBERS)]: (state) => getMemberHandler(state),
    [asyncPending(types.TYPE_UPDATE_MEMBER_STATUS)]: (state) => updateMemberStatusHandler(state),
    [asyncPending(types.TYPE_REMOVE_MEMBER)]: (state) => removeMemberHandler(state),
    [asyncPending(types.TYPE_CHECK_MEMBER_STATUS)]: (state) => checkMemberStatusPendingHandler(state),
    [asyncPending(types.TYPE_LOAD_REMOTE_CONFIG)]: (state) => loadRemoteConfigPendingHandler(state),
    // fulfilled
    [asyncFulfilled(types.TYPE_GET_ALL_BOSS)]: (state, { payload }) => getAllBossHandler(state, payload),
    [asyncFulfilled(types.TYPE_CREATE_BOSS)]: (state, { payload }) => createBossHandler(state, payload),
    [asyncFulfilled(types.TYPE_KILL_BOSS)]: (state, { payload }) => updateBossHandler(state, payload),
    [asyncFulfilled(types.TYPE_UPDATE_BOSS)]: (state, { payload }) => updateBossHandler(state, payload),
    [asyncFulfilled(types.TYPE_SET_BOSS_RANDOM_TIME)]: (state, { payload }) => updateBossHandler(state, payload),
    [asyncFulfilled(types.TYPE_UPLOAD_LOCAL_TO_CLOUD)]: (state, { payload }) => upload2CloudHandler(state, payload),
    [asyncFulfilled(types.TYPE_DELETE_BOSS)]: (state, { payload }) => deleteBossHandler(state, payload),
    [asyncFulfilled(types.TYPE_APPLY_MEMBER)]: (state, { payload }) => applyMemberHandler(state, payload),
    [asyncFulfilled(types.TYPE_GET_MEMBERS)]: (state, { payload }) => getMemberHandler(state, payload),
    [asyncFulfilled(types.TYPE_CHECK_MEMBER_STATUS)]: (state, { payload }) => checkMemberStatusHandler(state, payload),
    [asyncFulfilled(types.TYPE_UPDATE_MEMBER_STATUS)]: (state, { payload }) => updateMemberStatusHandler(state, payload),
    [asyncFulfilled(types.TYPE_REMOVE_MEMBER)]: (state, { payload }) => removeMemberHandler(state, payload),
    [asyncFulfilled(types.TYPE_LOAD_REMOTE_CONFIG)]: (state, { payload }) => loadRemoteConfigHandler(state, payload),
    // rejected
    [asyncRejected(types.TYPE_GET_ALL_BOSS)]: (state, { payload }) => rejectedHandler(state, payload),
    [asyncRejected(types.TYPE_CREATE_BOSS)]: (state, { payload }) => rejectedHandler(state, payload),
    [asyncRejected(types.TYPE_KILL_BOSS)]: (state, { payload }) => rejectedHandler(state, payload),
    [asyncRejected(types.TYPE_UPDATE_BOSS)]: (state, { payload }) => rejectedHandler(state, payload),
    [asyncRejected(types.TYPE_SET_BOSS_RANDOM_TIME)]: (state, { payload }) => rejectedHandler(state, payload),
    [asyncRejected(types.TYPE_UPLOAD_LOCAL_TO_CLOUD)]: (state, { payload }) => rejectedHandler(state, payload),
    [asyncRejected(types.TYPE_DELETE_BOSS)]: (state, { payload }) => rejectedHandler(state, payload),
    [asyncRejected(types.TYPE_APPLY_MEMBER)]: (state, { payload }) => applyMemberHandler(state, null, payload),
    [asyncRejected(types.TYPE_GET_MEMBERS)]: (state, { payload }) => getMemberHandler(state, null, payload),
    [asyncRejected(types.TYPE_CHECK_MEMBER_STATUS)]: (state, { payload }) => checkMemberStatusHandler(state, null, payload),
    [asyncRejected(types.TYPE_UPDATE_MEMBER_STATUS)]: (state, { payload }) => updateMemberStatusHandler(state, null, payload),
    [asyncRejected(types.TYPE_REMOVE_MEMBER)]: (state, { payload }) => removeMemberHandler(state, null, payload),
}, initState)