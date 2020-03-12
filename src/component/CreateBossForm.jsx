import React, {
    useRef
} from 'react'

import { 
    Form,
    Input,
    Button
} from 'element-react/next'

import { connect } from 'react-redux'
import propTypes from 'prop-types'
import { createEdit, createBoss, create, startLoading } from '../common/actions'

const styles = {
    form: {
      maxWidth: 400,
    },
    name: {
      margin: 5,
      height: 60
    },
    time: {
      margin: 5,
    },
    button: {
      margin: 5,
    },
}

const CREATE_BOSS_RULES = {
    name: [
        { required: true, message: '請輸入BOSS名稱', trigger: 'submit' },
    ],
}

function CreateBossForm(props) {
    const { onCreate, form, onEdit, onCreateBoss, user } = props
    const formRef = useRef()
    const timeRef = useRef()

    const submitHandler = e => {
        e.preventDefault()
        formRef.current.validate((valid) => {
            if (valid) {
                const data = {
                    ...form, 
                    cd: timeRef.current.value.length ? +timeRef.current.value : 0
                }
                if (user) {
                    onCreateBoss(user.uid, data)
                } else {
                    onCreate(data)
                }
                formRef.current.resetFields()
                timeRef.current.value = null
            } else {
                return false
            }
        })
    }

    return (
        <Form 
            ref={formRef}
            model={form} 
            labelWidth={150} 
            style={styles.form}
            onSubmit={submitHandler}
            rules={CREATE_BOSS_RULES}
        >
            <Form.Item label={'請輸入BOSS名稱'} style={styles.name} prop={'name'}>
                <Input 
                    onChange={e => onEdit({...form, name: e})}
                    placeholder={'請輸入BOSS名稱'}
                    value={form.name} 
                />
            </Form.Item>
            <Form.Item label={'冷卻時間(分鐘)'} style={styles.time} prop={'time'}>
                <div className='el-input-number'>
                    <input
                        ref={timeRef}
                        className='form-control' 
                        type={'number'}
                        min={0}
                        max={60 * 24}
                    />
                </div>
            </Form.Item>
            <Form.Item style={styles.button}>
                <Button icon={'plus'} nativeType={'submit'} type={'info'}>新增</Button>
            </Form.Item>
        </Form>
    )
}

CreateBossForm.propTypes = {
    user: propTypes.object,
    form: propTypes.object.isRequired,
    onCreate: propTypes.func.isRequired,
    onCreateBoss: propTypes.func.isRequired,
    onEdit: propTypes.func.isRequired,
}

const mapState2Props = state => ({
    form: state.form,
    user: state.user
})

const mapDispatch2Props = dispatch => ({
    onCreateBoss: (id, data) => dispatch(startLoading()) & dispatch(createBoss(id, data)),
    onCreate: (data) => dispatch(create(data)),
    onEdit: data => dispatch(createEdit(data))
})

export default connect(mapState2Props, mapDispatch2Props)(CreateBossForm)