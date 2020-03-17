import React, { useRef, useEffect, useState } from 'react'
import { 
    Form, 
    Dialog,  
    Button
} from 'element-react/next'

import { TimePicker } from 'antd'
import moment from 'moment-timezone'

import PropTypes from 'prop-types'
import { TIME_FORMAT } from '../common/constants'


const styles = {
    time: {
      margin: 5,
    },
    input: {
        width: '200px',
    },
    dialog: {
        width: '450px',
    }
}

function EditBossDialog(props) {
    const { boss, onCancel, onUpdateBoss, user } = props

    const editDealTimeRef = useRef()
    const editCdRef = useRef()
    const [dealTime, setDealTime] = useState(null)

    const submitHandler = e => {
        e.preventDefault()
        onUpdateBoss(user && user.uid, boss.key, {
            cd: editCdRef.current.value.length ? +editCdRef.current.value : null,
            dealTime: dealTime && moment(dealTime).format(TIME_FORMAT),
        })
        onCancel()
    }

    useEffect(() => {
        if (boss) {
            editCdRef.current.value = +boss.cd || null
            setDealTime(boss.dealTime && moment(boss.dealTime, TIME_FORMAT))
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
                        <TimePicker
                            style={styles.input}
                            onChange={e => setDealTime(e)}
                            value={dealTime}
                            format={TIME_FORMAT}
                            ref={editDealTimeRef}
                        />
                    </Form.Item>
                    <Form.Item label={'冷卻時間(分鐘)'} style={styles.time} labelWidth={'120'}>
                        <div className='el-input-number'>
                            <input
                                style={styles.input}
                                ref={editCdRef}
                                className='form-control' 
                                type={'number'}
                                min={0}
                                max={60 * 24}
                            />
                        </div>
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
}

export default EditBossDialog


