import moment from 'moment-timezone'

import {
    TIME_FORMAT,
    TIME_NUM_FORMAT
} from './constants'

class Service {
    static killBoss(inputBoss) {
        if (!inputBoss) {
            throw new Error('not found')
        }
        const boss = {...inputBoss}
        const currentTime = moment()
        boss.dealTime = currentTime.format(TIME_FORMAT)
        boss.dealTimeNum = +currentTime.format(TIME_NUM_FORMAT)
        boss.nextTime = currentTime
            .add(boss.cd + (boss.randomTime || 0), 'minutes')
            .format(TIME_FORMAT)
        return boss
    }

    static setBossRandomTime(inputBoss, randomTime) {
        if (!inputBoss) {
            throw new Error('not found')
        }

        const boss = {...inputBoss}

        boss.randomTime = randomTime
        if (boss.dealTime) {
            boss.nextTime = moment(boss.dealTime, TIME_FORMAT)
            .add(boss.cd + boss.randomTime, 'minutes')
            .format(TIME_FORMAT)
        }
        return boss
    }

    static updateBoss(inputBoss, newBoss = {}) {
        if (!inputBoss) {
            throw new Error('not found')
        }

        const boss = {...inputBoss}

        boss.cd = newBoss.cd || boss.cd
        boss.dealTime = newBoss.dealTime
        boss.nextTime = null
        
        if (boss.dealTime) {
            boss.nextTime = moment(boss.dealTime, TIME_FORMAT)
                .add(+boss.cd + +boss.randomTime, 'minutes')
                .format(TIME_FORMAT)
        }

        Object.keys(boss).forEach(key => {
            if (boss[key] === undefined) {
                delete boss[key]
            } 
        })

        return boss
    }

    static createBoss(inputBoss) {
        return {
            name: inputBoss.name,
            dealTime: null,
            dealTimeNum: null,
            nextTime: null,
            randomTime: 0,
            cd: inputBoss.cd || 0,
            idx: inputBoss.key,
            key: inputBoss.key
        }
    }
}

export default Service