import React, { useEffect } from 'react'
import { Button, Layout, Spin } from 'antd'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { signInUser, setUser, signOutUser, setAuthChanging } from '../common/actions'
import { auth } from '../common/api'

const styles = {
    version: {
        width: '120px',
        background: 'rgba(255, 255, 255, 0.2)',
        float: 'left',
        color: '#fff',
        paddingLeft: '30px',
        fontSize: '18px',
    },
    login: {
        float: 'right',
        height: '31px',
    }
}

const { Header } = Layout

const MainHeader = (props) => {
    const { user, onSignInUser, onSignOutUser, onSetUser, isAuthChanging, onSetAuthChanging } = props

    useEffect(() => {
        onSetAuthChanging(true)
        auth.onAuthStateChanged(user => {
            onSetUser(user)
            onSetAuthChanging(false)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const renderLoginButton = (user, isAuthChanging) => {
        if (isAuthChanging) {
            return <Spin />
        }

        if (user) {
            return <Button shape='round' block onClick={onSignOutUser}>{user.displayName} Sign out</Button>
        } else if (user === null) {
            return <Button shape='round' danger onClick={onSignInUser}>Sign in with Google</Button>
        }
    }

    return (
        <>
            <style>{`
                .login {
                    float: right;
                    height: 31px;
                }
            `}</style>
            <Header>
                <div style={styles.version} >
                    {process.env.REACT_APP_VERSION} 
                </div>
                <div style={styles.login}>
                    {renderLoginButton(user, isAuthChanging)}
                </div>
            </Header>
        </>
    )
}

MainHeader.propTypes = {
    user: PropTypes.object,
    isAuthChanging: PropTypes.bool.isRequired,
    onSignInUser: PropTypes.func.isRequired,
    onSignOutUser: PropTypes.func.isRequired,
    onSetUser: PropTypes.func.isRequired,
    onSetAuthChanging: PropTypes.func.isRequired,
}

const mapState2Props = state => ({
    user: state.user,
    isAuthChanging: state.isAuthChanging
})

const mapDispatch2Props = dispatch => ({
    onSignInUser: () => dispatch(setAuthChanging(true)) & dispatch(signInUser()),
    onSignOutUser: () => dispatch(setAuthChanging(true)) & dispatch(signOutUser()),
    onSetUser: user => dispatch(setUser(user)),
    onSetAuthChanging: isChanging => dispatch(setAuthChanging(isChanging))
})

export default connect(mapState2Props, mapDispatch2Props)(MainHeader)