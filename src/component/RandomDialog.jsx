import React from 'react'
import { 
    Dialog, Button 
} from 'element-react/next'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    setRandomDialogVisible,
    setRandomTime,
    setBossRandomTime,
    setRandomBoss,
} from '../common/actions'

const styles = {
    button: {
        margin: 5,
        height: 50,
        width: 50,
    }
}

function createButton(choiceNum, num, onChoice, onCancel) {
    return <Button 
        key={num}
        style={styles.button} 
        type={(choiceNum === num) ? 'info' : null} 
        onClick={() => {
            onChoice && onChoice(num)
            onCancel && onCancel()
        }}
    >{num}</Button>
}

function RandomDialog(props) {
    const { 
        user, 
        onCancel, 
        onSetRandomTime,
        onSetBossRandomTime,
        boss,
    } = props

    const onChoice = (num) => {
        if (user) {
          onSetBossRandomTime(user.uid, boss.key, num)
        } else {
          onSetRandomTime({num, key: boss.key})
        }
        onCancel()
      }
    
    const buttons1 = !!boss ?  [0, 1, 2, 3, 4, 5].map(num => (
        createButton(boss.randomTime, num, onChoice, onCancel)
    )) : null
    const buttons2 = !!boss ?  [6, 7, 8, 9, 10].map(num => (
        createButton(boss.randomTime, num, onChoice, onCancel)
    )) : null
    return (
        <Dialog
            title='隨機數'
            visible={!!boss}
            onCancel={() => onCancel && onCancel()}
            size={'tiny'}
        >
            <Dialog.Body>
                <div>{buttons1}</div>
                <div>{buttons2}</div>
            </Dialog.Body>
        </Dialog>
    )
}

RandomDialog.propTypes = {
    user: PropTypes.object,
    boss: PropTypes.object,
    isShowDialog: PropTypes.bool,
    onCancel: PropTypes.func,
    onChoice: PropTypes.func,
    choiceNum: PropTypes.number,
    onSetRandomTime: PropTypes.func.isRequired,
    onSetBossRandomTime: PropTypes.func.isRequired,
}

const mapState2Props = state => ({
    user: state.user,
    boss: state.randomBoss,
})

const mapDispatch2Props = dispatch => ({
    onCancel: () => dispatch(setRandomBoss(null)),
    onSetRandomTime: data => dispatch(setRandomTime(data)),
    onSetBossRandomTime: (userId, bossKey, randomTime) => dispatch(setBossRandomTime(userId, bossKey, randomTime)),
})

export default connect(mapState2Props, mapDispatch2Props)(RandomDialog)

