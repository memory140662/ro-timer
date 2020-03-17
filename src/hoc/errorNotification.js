import React, { Component } from 'react'
import { connect } from 'react-redux'
import { notification } from 'antd'

const mapState2Props = state => ({
    error: state.error,
})

const errorNotification = (Cmp) => {
    return connect(mapState2Props)(class extends Component {

        componentWillReceiveProps(props) {
            const { error } = props
            if (error) {
                notification.error({
                    message: '發生異常',
                    description: error,
                    duration: 3.5,
                    top: 65
                })
            }
        }

        render() {
            return <Cmp {...this.props}/>
        }
    })
}

export default errorNotification