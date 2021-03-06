import React, { useRef, useEffect, useState } from 'react'
import { 
    Form, 
    Dialog,  
    Button,
} from 'element-react/next'
import { connect } from 'react-redux'

import { TimePicker } from 'antd'
import moment from 'moment-timezone'

import PropTypes from 'prop-types'
import { TIME_FORMAT } from '../common/constants'

import {
    editCancel,
    update,
    updateBoss,
} from '../common/actions'

import { useLocation } from 'react-router-dom'
import NumberInput from './NumberInput'
const useQuery = () => (new URLSearchParams(useLocation().search))

const styles = {
    time: {
      margin: 5,
    },
    input: {
        width: '200px',
    },
    dialog: {
        width: '450px',
    },
}

function EditBossDialog(props) {
    const { boss, onCancel, onUpdateBoss, user, onEditConfirm } = props

    const editDealTimeRef = useRef()
    const editCdRef = useRef()
    const [dealTime, setDealTime] = useState(null)

    const query = useQuery()
    const id = query.get('id')

    const submitHandler = e => {
        e.preventDefault()
        const data = {
            cd: editCdRef.current.value.length ? +editCdRef.current.value : null,
            dealTime: dealTime,
        }
        if (user) {
            onUpdateBoss(id || user.uid, boss.key, data)
        } else {
            onEditConfirm({...data, key: boss.key})
        }
        onCancel()
    }

    useEffect(() => {
        if (boss) {
            editCdRef.current.value = +boss.cd || null
            setDealTime(boss.dealTime && moment(boss.dealTime, boss.dealTime.length > 5 ? undefined : TIME_FORMAT))
        }
    }, [boss])

    return (
        <Dialog
            style={styles.dialog}
            title={boss && boss.name}
            visible={ !!boss }
            onCancel={onCancel}
        >
            <Form onSubmit={submitHandler} >
                <Dialog.Body>
                    <Form.Item label={'死亡時間'} style={styles.time} labelWidth={'120'}>
                        <style>{`
                            .ant-picker-now {
                                visibility: hidden;
                            }
                        `}</style>
                        <TimePicker
                            style={styles.input}
                            onChange={e => setDealTime(e)}
                            value={dealTime}
                            format={TIME_FORMAT}
                            ref={editDealTimeRef}
                        />
                    </Form.Item>
                    <Form.Item label={'冷卻時間(分鐘)'} style={styles.time} labelWidth={'120'}>
                        <NumberInput
                            style={styles.input}
                            ref={editCdRef}
                            min={0}
                            max={60 * 24}/>
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

EditBossDialog.propTypes = {
    boss: PropTypes.object,
    user: PropTypes.object,
    onCancel: PropTypes.func.isRequired,
    onUpdateBoss: PropTypes.func.isRequired,
    onEditConfirm: PropTypes.func.isRequired,
}

const mapState2Props = state => ({
    boss: state.currentBoss,
    user: state.user,
})

const mapDispatch2Props = dispatch => ({
    onCancel: () => dispatch(editCancel()),
    onEditConfirm: (data) => dispatch(update(data)),
    onUpdateBoss: (userId, bossKey, data) => dispatch(updateBoss(userId, bossKey, data)),
})

export default connect(mapState2Props, mapDispatch2Props)(EditBossDialog)


