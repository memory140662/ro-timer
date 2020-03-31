import React from 'react'
import PropTypes from 'prop-types'

const NumberInput = React.forwardRef((props, ref) => {
    return (
        <div className='el-input-number'>
            <input
                {...props}
                ref={ref}
                className='form-control' 
                type={'number'}
            />
        </div>
    )
})

NumberInput.propTypes = {
    style: PropTypes.object,
    min: PropTypes.number,
    max: PropTypes.number,
}

export default NumberInput