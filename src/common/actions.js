import * as types from './types'
import { createAction } from 'redux-actions'
import * as Api from './api'

export const create = createAction(types.TYPE_CREATE)
export const setUser = createAction(types.TYPE_SET_USER)
export const kill = createAction(types.TYPE_KILL)
export const deleteLocal = createAction(types.TYPE_DELETE)
export const edit = createAction(types.TYPE_EDIT)
export const editConfirm = createAction(types.TYPE_EDIT_CONFIRM)
export const editCancel = createAction(types.TYPE_EDIT_CANCEL)
export const save = createAction(types.TYPE_SAVE_DATA)
export const load = createAction(types.TYPE_LOAD_DATA)
export const startLoading = createAction(types.TYPE_START_LOADING)
export const setRandomTime = createAction(types.TYPE_SET_RANDOM_TIME)
export const checkLocal = createAction(types.TYPE_CHECK_LOCAL)
export const deleteLocalData = createAction(types.TYPE_DELETE_LOCAL_DATA)
export const setAuthChanging = createAction(types.TYPE_SET_AUTH_CHANGING)
export const setCreateDialogVisible = createAction(types.TYPE_SET_CREATE_DIALOG_VISIBLE)
export const receiveBossChanged = createAction(types.TYPE_RECEIVE_BOSS_CHANGED)
export const receiveBossAdded = createAction(types.TYPE_RECEIVE_BOSS_ADDED)
export const receiveBossRemove = createAction(types.TYPE_RECEIVE_BOSS_REMOVED)
export const setRandomBoss = createAction(types.TYPE_SET_RANDOM_BOSS)
export const setMemberStatus = createAction(types.TYPE_SET_MEMBER_STATUS)
export const receiveMemberApply = createAction(types.TYPE_RECEIVE_MEMBER_APPLY)

// async
export const deleteBoss = createAction(types.TYPE_DELETE_BOSS, Api.deleteBoss)
export const setBossRandomTime = createAction(types.TYPE_SET_BOSS_RANDOM_TIME, Api.setRandomTime)
export const signInUser = createAction(types.TYPE_SIGN_IN_USER, Api.signInUser)
export const signOutUser = createAction(types.TYPE_SIGN_OUT_USER, Api.signOutUser)
export const getAllBoss = createAction(types.TYPE_GET_ALL_BOSS, Api.getAllBoss)
export const createBoss = createAction(types.TYPE_CREATE_BOSS, Api.createBoss)
export const updateBoss = createAction(types.TYPE_UPDATE_BOSS, Api.updateBoss)
export const killBoss = createAction(types.TYPE_KILL_BOSS, Api.killBoss)
export const uploadToCloud = createAction(types.TYPE_UPLOAD_LOCAL_TO_CLOUD, Api.updateToCloud)
export const applyMember = createAction(types.TYPE_APPLY_MEMBER, Api.applyMember)
export const getMembers = createAction(types.TYPE_GET_MEMBERS, Api.getMembers)
export const checkMemberStatus = createAction(types.TYPE_CHECK_MEMBER_STATUS, Api.checkMemberStatus)
export const updateMemberStatus = createAction(types.TYPE_UPDATE_MEMBER_STATUS, Api.updateMemberStatus)
export const removeMember = createAction(types.TYPE_REMOVE_MEMBER, Api.removeMember)
