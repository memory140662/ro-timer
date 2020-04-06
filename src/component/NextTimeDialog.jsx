import React, { useRef, useEffect } from 'react'
import { Form, Dialog, Button, Checkbox } from 'element-react/next'
import NumberInput from './NumberInput'
import PropTypes from 'prop-types'
import { setBossNextTime, setNextTime, setNextTimeBoss } from '../common/actions'
import { connect } from 'react-redux'

import { useLocation } from 'react-router-dom'
const useQuery = () => (new URLSearchParams(useLocation().search))

const styles = {
    form: {
        maxWidth: 400,
    },
    input: {
        width: '200px',
    },
    dialog: {
        width: '450px',
    },
}

function NextTimeDialog(props) {
    const { 
        user, 
        boss,
        onSetNextTime,
        onSetBossNextTime,
        onCancel,
    } = props
    const inputHourRef = useRef()
    const inputMinuteRef = useRef()
    const checkboxRef = useRef()

    const query = useQuery()
    const id = query.get('id')

    useEffect(() => {
        if (boss) {
            inputHourRef.current.focus()
            inputHourRef.current.value = 0
            inputMinuteRef.current.value = 0
            checkboxRef.current.state.checked = false
        }
    }, [boss])

    const submitHandler = e => {
        e.preventDefault()
        const minutes = (parseInt(inputHourRef.current.value) * 60) + parseInt(inputMinuteRef.current.value)
        if (user) {
            onSetBossNextTime(id || user.uid, boss.key, minutes, checkboxRef.current.state.checked)
        } else {
            onSetNextTime(boss.key, minutes, checkboxRef.current.state.checked)
        }
        onCancel()
    }
    return (
        <Dialog
            style={styles.dialog}
            title={boss && boss.name}
            visible={ !!boss }
            onCancel={onCancel}
        >
            <Form onSubmit={submitHandler} labelWidth={150} >
                <Dialog.Body>
                    <Form.Item label={'多久後重生(小時)'}>
                        <NumberInput 
                            style={styles.input}
                            ref={inputHourRef}
                            min={0}
                            max={24}
                        />
                    </Form.Item>
                    <Form.Item label={'多久後重生(分鐘)'}>
                        <NumberInput 
                            style={styles.input}
                            ref={inputMinuteRef}
                            min={0}
                            max={60}
                        />
                    </Form.Item>
                    <Form.Item label={'使用雷達'}>
                        <Checkbox ref={checkboxRef}/>
                    </Form.Item>
                </Dialog.Body>
                <Dialog.Footer className={'dialog-footer'}>
                    <Button onClick={onCancel}>取消</Button>
                    <Button type={'primary'} nativeType={'submit'}>確定</Button>
                </Dialog.Footer>
            </Form>
        </Dialog>
    )
}

NextTimeDialog.propTypes = {
    user: PropTypes.object,
    boss: PropTypes.object,
    onSetBossNextTime: PropTypes.func.isRequired,
    onSetNextTime: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}

const mapState2Props = state => ({
    user: state.user,
    boss: state.nextTimeBoss,
})

const mapDispatch2Props = dispatch => ({
    onSetNextTime: (bossKey, afterMinutes, isRadarUsed) => dispatch(setNextTime({key:bossKey, afterMinutes, isRadarUsed})),
    onSetBossNextTime: (userId, bossKey, afterMinutes, isRadarUsed) => dispatch(setBossNextTime(userId, bossKey, afterMinutes, isRadarUsed)),
    onCancel: () => dispatch(setNextTimeBoss()),
})

export default connect(mapState2Props, mapDispatch2Props)(NextTimeDialog)