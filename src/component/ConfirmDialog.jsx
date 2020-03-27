import React from 'react'
import { Dialog, Button } from 'element-react/next'
import PropTypes from 'prop-types'

const styles = {
    dialog: {
        width: '360px',
    },
    button: {
        margin: '5px',
    },
}

const renderMessage = message => {
    if (message instanceof String) {
        return message
    }

    const C = message
    return C ? <C /> : null
}

const ConfirmDialog = (props) => {

    const cancelHandler = () => {
        props.onCancel && props.onCancel()
    }

    const confirmHandler = () => {
        props.onConfirm && props.onConfirm()
    }

    return (
        <Dialog
            style={styles.dialog}
            title={props.title}
            size='tiny'
            visible={!!props.visible}
            onCancel={cancelHandler}
        >
            <Dialog.Body>
                {props.visible ? <span>{renderMessage(props.message)}</span> : null}
            </Dialog.Body>
            <Dialog.Footer className='dialog-footer'>
                <Button style={styles.button} icon={'close'} onClick={cancelHandler}>取消</Button>
                <Button style={styles.button} icon={'check'} type={'danger'} onClick={() => confirmHandler() | cancelHandler()}>確定</Button>
            </Dialog.Footer>
        </Dialog>
    )
}

ConfirmDialog.propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    message: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
    ]),
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
}

export default ConfirmDialog