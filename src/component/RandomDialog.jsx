import React from 'react'
import { 
    Dialog, Button 
} from 'element-react/next'
import PropTypes from 'prop-types'

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
    const { isShowDialog, onCancel, onChoice, choiceNum = 0 } = props
    
    const buttons1 = isShowDialog ?  [0, 1, 2, 3, 4, 5].map(num => (
        createButton(choiceNum, num, onChoice, onCancel)
    )) : null
    const buttons2 = isShowDialog ?  [6, 7, 8, 9, 10].map(num => (
        createButton(choiceNum, num, onChoice, onCancel)
    )) : null
    return (
        <Dialog
            title='隨機數'
            visible={isShowDialog}
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
    isShowDialog: PropTypes.bool,
    onCancel: PropTypes.func,
    onChoice: PropTypes.func,
    choiceNum: PropTypes.number,
}


export default RandomDialog

