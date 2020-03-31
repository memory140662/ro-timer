import React, {
    useRef, useState,
} from 'react'

import { 
    Form,
    Input,
    Button,
    Dialog,
} from 'element-react/next'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { createBoss, create, setCreateDialogVisible } from '../common/actions'

import { useLocation } from 'react-router-dom'
const useQuery = () => (new URLSearchParams(useLocation().search))

const styles = {
    form: {
      maxWidth: 400,
    },
    name: {
      margin: 5,
      height: 60,
    },
    time: {
      margin: 5,
    },
    button: {
      margin: 5,
    },
    input: {
        width: '200px',
    },
    dialog: {
        width: '450px',
    },
}

const CREATE_BOSS_RULES = {
    name: [
        { required: true, message: '請輸入BOSS名稱', trigger: 'submit' },
    ],
}

function CreateBossDialog(props) {
    const { 
        onCreate, 
        onCreateBoss, 
        user, 
        isCreateDialogVisible ,
        onCancel,
    } = props
    const formRef = useRef()
    const timeRef = useRef()
    const [ form, setForm ] = useState({
        name: null,
    })

    const query = useQuery()
    const id = query.get('id')

    const submitHandler = e => {
        e.preventDefault()
        formRef.current.validate((valid) => {
            if (valid) {
                const data = {
                    ...form, 
                    cd: timeRef.current.value.length ? +timeRef.current.value : 0,
                }
                if (user) {
                    onCreateBoss(id || user.uid, data)
                } else {
                    onCreate(data)
                }
                cancelHandler()
            } else {
                return false
            }
        })
    }

    const cancelHandler = () => {
        formRef.current.resetFields()
        timeRef.current.value = null
        onCancel()
    }

    return (
        <Dialog 
            visible={isCreateDialogVisible}
            onCancel={cancelHandler}   
            title={'創建BOSS'} 
            style={styles.dialog}
        >
            <Form 
                ref={formRef}
                model={form} 
                labelWidth={150} 
                style={styles.form}
                onSubmit={submitHandler}
                rules={CREATE_BOSS_RULES}
            >
                <Dialog.Body>
                    <Form.Item label={'請輸入BOSS名稱'} style={styles.name} prop={'name'}>
                        <Input 
                            style={styles.input}
                            onChange={e => setForm({...form, name: e})}
                            placeholder={'請輸入BOSS名稱'}
                            value={form.name} 
                        />
                    </Form.Item>
                    <Form.Item label={'冷卻時間(分鐘)'} style={styles.time} prop={'time'}>
                        <div className='el-input-number'>
                            <input
                                style={styles.input}
                                ref={timeRef}
                                className='form-control' 
                                type={'number'}
                                min={0}
                                max={60 * 24}
                            />
                        </div>
                    </Form.Item>
                </Dialog.Body>
                <Dialog.Footer className={'dialog-footer'}>
                    <Form.Item style={styles.button}>
                        <Button onClick={cancelHandler}>取消</Button>
                        <Button nativeType={'submit'} type={'primary'}>確認</Button>
                    </Form.Item>
                </Dialog.Footer>
            </Form>
        </Dialog>
    )
}

CreateBossDialog.propTypes = {
    user: PropTypes.object,
    isCreateDialogVisible: PropTypes.bool.isRequired,

    onCreate: PropTypes.func.isRequired,
    onCreateBoss: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}

const mapState2Props = state => ({
    user: state.user,
    isCreateDialogVisible: state.isCreateDialogVisible,
})

const mapDispatch2Props = dispatch => ({
    onCreateBoss: (id, data) => dispatch(createBoss(id, data)),
    onCreate: (data) => dispatch(create(data)),
    onCancel: () => dispatch(setCreateDialogVisible(false)),
})

export default connect(mapState2Props, mapDispatch2Props)(CreateBossDialog)