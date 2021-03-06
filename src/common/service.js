import moment from 'moment-timezone'
class Service {
    
    static setNextTime(inputBoss, afterMinutes = 0, isRadarUsed = false) {
        if (!inputBoss) {
            throw new Error('not found')
        }
        const boss = {...inputBoss}
        const currentTime = moment()
        boss.nextTime = currentTime.add(afterMinutes, 'minutes').toString()
        boss.dealTime = moment(boss.nextTime).add(-(boss.cd || 0), 'minutes').toString()
        boss.randomTime = 0
        boss.isRadarUsed = isRadarUsed
        return boss
    }

    static killBoss(inputBoss, randomTime) {
        if (!inputBoss) {
            throw new Error('not found')
        }
        const boss = {...inputBoss}
        const currentTime = moment()
        boss.dealTime = currentTime.toString()
        boss.isRadarUsed = (randomTime === undefined) ? false : true
        boss.randomTime = randomTime || 0
        boss.nextTime = currentTime
            .add(boss.cd + boss.randomTime, 'minutes')
            .toString()
        return boss
    }

    static setBossRandomTime(inputBoss, randomTime) {
        if (!inputBoss) {
            throw new Error('not found')
        }

        const boss = {...inputBoss}
        boss.isRadarUsed = true
        boss.randomTime = randomTime
        if (boss.dealTime) {
            boss.nextTime = moment(boss.dealTime)
            .add(boss.cd + boss.randomTime, 'minutes')
            .toString()
        }
        return boss
    }

    static updateBoss(inputBoss, newBoss = {}) {
        if (!inputBoss) {
            throw new Error('not found')
        }

        const boss = {...inputBoss}

        boss.cd = newBoss.cd || boss.cd
        boss.dealTime = newBoss.dealTime ? moment(newBoss.dealTime).toString() : null
        boss.nextTime = null
        
        if (boss.dealTime) {
            boss.nextTime = moment(boss.dealTime)
                .add(+boss.cd + +boss.randomTime, 'minutes')
                .toString()
        }

        if (newBoss.isRadarUsed !== undefined) {
            boss.isRadarUsed = newBoss.isRadarUsed
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
            nextTime: null,
            randomTime: 0,
            cd: inputBoss.cd || 0,
            idx: inputBoss.key,
            key: inputBoss.key,
        }
    }
}

export default Service