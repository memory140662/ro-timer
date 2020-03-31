import React from 'react'
import { Dialog } from 'element-react/next'
import { 
    Button,
    Row,
    Col,
} from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    setRandomTime,
    setBossRandomTime,
    setRandomBoss,
} from '../common/actions'

import { useLocation } from 'react-router-dom'
const useQuery = () => (new URLSearchParams(useLocation().search))

const renderButton = (choiceNum, onChoice, onCancel, maxRandomNum) => {
    const buttons = []
    for (let i = 0; i <= maxRandomNum; i++) {
        buttons.push(
            <Col key={i}>
                <Button 
                    key={i}
                    size={'large'}
                    shape={'circle'}
                    type={(choiceNum === i) ? 'primary' : null} 
                    onClick={() => {
                        onChoice && onChoice(i)
                        onCancel && onCancel()
                    }}
                >{i}</Button>
            </Col>
        )
    }
    return (
        <Row gutter={[16, 16]}>
            {buttons}
        </Row>
    )
}

function RandomDialog(props) {
    const { 
        user, 
        onCancel, 
        onSetRandomTime,
        onSetBossRandomTime,
        boss,
        maxRandomNum,
    } = props

    const query = useQuery()
    const id = query.get('id')

    const onChoice = (num) => {
        if (user) {
          onSetBossRandomTime(id || user.uid, boss.key, num)
        } else {
          onSetRandomTime({num, key: boss.key})
        }
        onCancel()
    }

    return (
        <Dialog
            title='隨機數'
            visible={!!boss}
            onCancel={() => onCancel && onCancel()}
            size={'tiny'}
        >
            <Dialog.Body>
                {renderButton(boss ? boss.randomTime : 0, onChoice, onCancel, maxRandomNum)}
            </Dialog.Body>
        </Dialog>
    )
}

RandomDialog.propTypes = {
    user: PropTypes.object,
    boss: PropTypes.object,
    maxRandomNum: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSetRandomTime: PropTypes.func.isRequired,
    onSetBossRandomTime: PropTypes.func.isRequired,
}

const mapState2Props = state => ({
    user: state.user,
    boss: state.randomBoss,
    maxRandomNum: state.maxRandomNum,
})

const mapDispatch2Props = dispatch => ({
    onCancel: () => dispatch(setRandomBoss(null)),
    onSetRandomTime: data => dispatch(setRandomTime(data)),
    onSetBossRandomTime: (userId, bossKey, randomTime) => dispatch(setBossRandomTime(userId, bossKey, randomTime)),
})

export default connect(mapState2Props, mapDispatch2Props)(RandomDialog)

