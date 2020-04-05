import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/analytics'
import 'firebase/remote-config'

import upload from 'immutability-helper'


import Service from './service'
import { MEMBER_STATUS_PENDING } from './constants'

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

firebase.initializeApp(firebaseConfig)
firebase.analytics()

export const auth = firebase.auth()
export const database = firebase.database()
export const remoteConfig = firebase.remoteConfig()

export const signInUser = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    const user = await firebase.auth().signInWithRedirect(provider)
    return user
}

export const signOutUser = async () => {
    await firebase.auth().signOut()
}

export const getAllBoss = async (userId) => {
    const snapshot = await database.ref()
        .child('users').child(userId).child('bosses').once('value')
    const out = []
    snapshot.forEach(childSnapshot => {
        out.push(childSnapshot.val())
    })
    return out   
}

export const createBoss = async (userId, payload) => {
    const path = `/users/${userId}/bosses`
    const reference = await database.ref(path).push()
    const newBoss = Service.createBoss({
        ...payload,
        idx: reference.key,
        key: reference.key,
    })
    await firebase.database().ref(path).child(reference.key).update(newBoss)

    return newBoss
}

export const updateBoss = async (userId, bossKey, payload) => {
    const path = `/users/${userId}/bosses/${bossKey}`
    const snapshot = await database.ref(path).once('value')
    const boss = snapshot.val()
    
    const newBoss = Service.updateBoss(boss, payload)

    await database.ref(path).update(newBoss)
    return newBoss
}

export const killBoss = async (userId, bossKey, randomTime) => {
    const path = `/users/${userId}/bosses/${bossKey}`
    const snapshot = await database.ref(path).once('value')
    const boss = snapshot.val()
    
    const newBoss = Service.killBoss(boss, randomTime)

    await database.ref(path).update(newBoss)
    return newBoss
}

export const setRandomTime = async (userId, bossKey, randomTime) => {
    const path = `/users/${userId}/bosses/${bossKey}`
    const snapshot = await database.ref(path).once('value')
    const boss = snapshot.val()
    
    const newBoss = Service.setBossRandomTime(boss, randomTime)

    await database.ref(path).update(newBoss)

    return newBoss
}

export const deleteBoss = async (userId, bossKey) => {
    const path = `/users/${userId}/bosses/${bossKey}`
    await database.ref(path).remove()
    return bossKey
}

export const updateToCloud = async (userId, data) => {
    const path = `/users/${userId}/bosses`
    const file = {}
    const bosses = data.map(async boss => {
        const push = await database.ref(path).push()
        const newBoss = upload(boss, {
            key: { $set: push.key },
            idx: { $set: push.key },
        })
        file[push.key] = newBoss
        return newBoss
    })
    const res = await Promise.all(bosses)
    await database.ref(path).remove()
    await database.ref(path).update(file)
    return res
}

export const applyMember = async (userId, member) => {
    const path = `/users/${userId}/members`
    const data = {
        uid: member.uid,
        displayName: member.displayName,
        photoURL: member.photoURL,
        status: MEMBER_STATUS_PENDING,
    }
    await database.ref(path).child(member.uid).set(data)
    return data
}

export const getMembers = async (userId) => {
    const path = `/users/${userId}/members`
    const snapshot = await database.ref(path).once('value')
    const out = []
    snapshot.forEach(childSnapshot => {
        out.push(childSnapshot.val())
    })
    return out   
}

export const checkMemberStatus = async (userId, memberId) => {
    const path = `/users/${userId}/members/${memberId}`
    const snapshot = await database.ref(path).once('value')
    if (snapshot.exists()) {
        return snapshot.child('status').val()
    }

    return ''
}

export const updateMemberStatus = async (userId, memberId, status) => {
    const path = `/users/${userId}/members/${memberId}`
    const snapshot = await database.ref(path).once('value')
    if (snapshot.exists()) {
        const val = snapshot.val()
        const data = upload(val, {
            status: { $set: status },
        })
        await database.ref(path).update(data)
        return data
    }
    return null
}

export const removeMember = async (userId, memberId) => {
    const path = `/users/${userId}/members/${memberId}`
    await database.ref(path).remove()
    return memberId
}

export const loadRemoteConfig = async () => {
    remoteConfig.settings = {
        minimumFetchIntervalMillis: 3600000,
    }

    remoteConfig.defaultConfig = ({
        maxRandomNum: 30,
    })

    try {
        await remoteConfig.fetchAndActivate()
    } catch (e) {

    }
    
    return {
        maxRandomNum: remoteConfig.getNumber('maxRandomNum'),
    }
}

export const setNextTime = async (userId, bossKey, afterMinutes) => {
    const path = `/users/${userId}/bosses/${bossKey}`
    const snapshot = await database.ref(path).once('value')
    const boss = snapshot.val()
    
    const newBoss = Service.setNextTime(boss, afterMinutes)

    await database.ref(path).update(newBoss)

    return newBoss
}