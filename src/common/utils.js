import {
    TIME_NUM_FORMAT,
    TIME_NUM_FORMAT2,
    TIME_NUM_FORMAT3,
    TIME_NUM_FORMAT4,
} from './constants'

export const getTimeNumFormat = (timeNumb) => {
    if (timeNumb && timeNumb >= 1000) {
        return TIME_NUM_FORMAT
    } else if (timeNumb && timeNumb >= 100) {
        return TIME_NUM_FORMAT2
    } else if (timeNumb && timeNumb >= 10) {
        return TIME_NUM_FORMAT3
    }

    return TIME_NUM_FORMAT4
}

export const asyncPending = type => `${type}_PENDING`

export const asyncFulfilled = type => `${type}_FULFILLED`

export const asyncRejected = type => `${type}_REJECTED`