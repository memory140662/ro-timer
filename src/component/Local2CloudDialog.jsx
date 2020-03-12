import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
    Dialog,
    Button
} from 'element-react/next'

import PropTypes from 'prop-types'

import {
    uploadToCloud, deleteLocalData, startLoading
} from '../common/actions'


const Local2CloudDialog = (props) => {
    const { user, localData, onUploadToCloud, onDeleteLocalData } = props
    const [isShowDialog, setShowDialog] = useState(true)

    if (!user) {
        return null
    }

    return (
        <Dialog
            title={'提示'}
            size={'small'}
            visible={!!user && !!localData && isShowDialog} 
            onCancel={() => setShowDialog(false)}
            lockScroll={ true }
            modal={true}
        >
            <Dialog.Body>
                <div>
                    <div>本地已有存在的BOSS數據，是否上傳至雲端？</div>
                    <div>(ps.如果雲端上已有數據將會被清除)</div>
                </div>
            </Dialog.Body>
            <Dialog.Footer className={'dialog-footer'}>
                <Button onClick={() => setShowDialog(false)}>取消</Button>
                <Button type={'danger'} onClick={onDeleteLocalData}>移除</Button>
                <Button type={'primary'} onClick={() => setShowDialog(false) & onUploadToCloud(user.uid, localData)}>確定</Button>
            </Dialog.Footer>
        </Dialog>
    )
}

Local2CloudDialog.propTypes = {
    user: PropTypes.object,
    localData: PropTypes.array,
    onUploadToCloud: PropTypes.func.isRequired,
    onDeleteLocalData: PropTypes.func.isRequired,
}

const mapState2Props = state => ({
    user: state.user,
    localData: state.localData
})

const mapDispatch2Props = dispatch => ({
    onUploadToCloud: (userId, data) => dispatch(startLoading()) & dispatch(uploadToCloud(userId, data)),
    onDeleteLocalData: () => dispatch(deleteLocalData()),
})

export default connect(mapState2Props, mapDispatch2Props)(Local2CloudDialog)