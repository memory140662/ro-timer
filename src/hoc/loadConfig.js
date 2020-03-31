import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadRemoteConfig } from '../common/actions'

const mapDispatch2Props = dispatch => ({
    onLoadRemoteConfig: data => dispatch(loadRemoteConfig(data)),
})

const loadConfig = (Cmp) => {
    return connect(null, mapDispatch2Props)(class extends Component {
        
        componentDidMount() {
            this.props.onLoadRemoteConfig()
        }

        render() {
            return <Cmp {...this.props}/>
        }
    })
}

export default loadConfig