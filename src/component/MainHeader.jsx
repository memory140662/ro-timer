import React, { useEffect } from 'react'
import { Button, Layout, Spin, Avatar, Popover } from 'antd'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import GoogleSvg from '../resource/img/google.svg'
import LogoutSvg from '../resource/img/logout.svg'
import ShareSvg from '../resource/img/share.svg'
import UserSvg from '../resource/img/user.svg'
import { useHistory } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'

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
        width: '50px',
        float: 'right',
        height: '65px',
    },
    share: {
        width: '50px',
        float: 'right',
        height: '65px',
    },
    avatar: {
        width: '50px',
        float: 'right',
        height: '65px',
        marginTop: '-2px',
    },
    avatarPhoto: {
        cursor: 'pointer',
    },
    userImg: {
        height: '30px',
        width: '30px',
        marginTop: '3px',
        marginLeft: '5px',
    },
    shareImg: {
        height: '100%',
        width: '100%',
        marginLeft: '-3px',
        marginTop: '-3px',
    },
    img: {
        height: '100%',
        width: '100%',
        marginTop: '-3px',
    },
    button: {
        backgroundColor: '#e8e8e8',
    },
}

const { Header } = Layout

const renderLoginButton = (user, isAuthChanging, onSignInUser, onSignOutUser) => {
    if (isAuthChanging) {
        return <Spin size={'large'} />
    }

    if (user) {
        return <Button 
            style={styles.button}
            size={'large'} 
            shape={'circle'} 
            icon={<img alt={''} src={LogoutSvg} width={styles.img.width} height={styles.img.height}/>} 
            onClick={onSignOutUser} 
        ></Button>
    } else if (user === null) {
        return <Button 
            style={styles.button}
            size={'large'} 
            shape={'circle'} 
            icon={<img alt={''} src={GoogleSvg} style={styles.img} width={styles.img.width} height={styles.img.height}/>} 
            onClick={onSignInUser}
        ></Button>
    }
}

const renderShareButton = (disabled, text) => {
    const content = (<strong>鏈接複製成功！</strong>)

    let btn = <Button 
        disabled={disabled} 
        size={'large'} 
        shape='circle' 
        icon={<img alt={''} src={ShareSvg} style={styles.shareImg}/>}
        style={styles.button}
    ></Button>

    if (disabled) {
        return btn
    }

    return (
        <CopyToClipboard text={text}>
            <Popover trigger={'click'} content={content}>
                {btn}
            </Popover>
        </CopyToClipboard>
    )
}

const MainHeader = (props) => {
    const { 
        user, 
        onSignInUser, 
        onSignOutUser, 
        onSetUser, 
        isAuthChanging, 
        onSetAuthChanging,
    } = props

    useEffect(() => {
        onSetAuthChanging(true)
        auth.onAuthStateChanged(user => {
            onSetUser(user)
            onSetAuthChanging(false)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const history = useHistory()

    const getShareText= userId => {
        let link = window.location.protocol
        link += `//${window.location.hostname}`
        if (window.location.port) {
            link += `:${window.location.port}`
        }
        link += `/?id=${userId}`
        return link
    }

    return (
        <>
            <Header>
                <div style={styles.version} >
                    {process.env.REACT_APP_VERSION} 
                </div>
                <div style={styles.login}>
                    {renderLoginButton(user, isAuthChanging, onSignInUser, onSignOutUser)}
                </div>
                <div style={styles.share}>
                    {renderShareButton(!user, (user ? getShareText(user.uid) : null))}
                </div>
                <div style={styles.avatar}>
                    <Avatar 
                        onClick={() => user && history.push('/')}
                        style={user ? styles.avatarPhoto : null}
                        icon={<img alt={''} src={UserSvg} style={styles.userImg}/>}
                        size={'large'}
                        alt={user ? user.displayName : null} 
                        src={user ? user.photoURL : null}
                    />    
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
    isAuthChanging: state.isAuthChanging,
})

const mapDispatch2Props = dispatch => ({
    onSignInUser: () => dispatch(setAuthChanging(true)) & dispatch(signInUser()),
    onSignOutUser: () => dispatch(setAuthChanging(true)) & dispatch(signOutUser()),
    onSetUser: user => dispatch(setUser(user)),
    onSetAuthChanging: isChanging => dispatch(setAuthChanging(isChanging)),
})

export default connect(mapState2Props, mapDispatch2Props)(MainHeader)