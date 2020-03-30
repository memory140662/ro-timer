import React, {
    useEffect,
} from 'react'
import { connect } from 'react-redux'
import { Table, Button, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { database } from '../common/api'
import PropTypes from 'prop-types'
import { getMembers, updateMemberStatus, removeMember, receiveMemberApply } from '../common/actions'
import { useLocation } from 'react-router-dom'
import { MEMBER_STATUS_PENDING, MEMBER_STATUS_APPLIED, MEMBER_STATUS_REJECTED } from '../common/constants'

const useQuery = () => (new URLSearchParams(useLocation().search))

const styles = {
    table: {
        margin: '10px',
    },
    button: {
        margin: '5px',
    },
    column: {
        color: '#000',
    },
    columnName: {
        marginLeft: '10px', 
        marginRight: '5px', 
        fontSize: '14px',
    },
    tableContent: {
        minHeight: window.innerHeight / 2,
    },
}

const MEMBER_STATUS = {
    [MEMBER_STATUS_PENDING]: '申請中',
    [MEMBER_STATUS_APPLIED]: '已同意',
    [MEMBER_STATUS_REJECTED]: '已拒絕',
}

const renderOperatorButton = (args) => {
    const { member, user, onStatusApply, onStatusReject, onRemoveMember } = args
    const buttons = []
    if (member.status === MEMBER_STATUS_PENDING) {
        buttons.push(<Button 
            key={'apply'}
            onClick={() => onStatusApply(user.uid, member.uid)}
            style={styles.button} 
            size={'small'} 
            type={'primary'}>同意</Button>
        )
        buttons.push(<Button 
            key={'reject'}
            onClick={() => onStatusReject(user.uid, member.uid)}
            style={styles.button} 
            size={'small'} 
            type={'primary'} 
            danger>拒絕</Button>)
    } else {
        if (member.status === MEMBER_STATUS_REJECTED) {
            buttons.push(<Button 
                key={'apply'}
                onClick={() => onStatusApply(user.uid, member.uid)}
                style={styles.button} 
                size={'small'} 
                type={'primary'}>同意</Button>
            )
        }
        buttons.push(<Button 
            key={'delete'}
            onClick={() => onRemoveMember(user.uid, member.uid)}
            style={styles.button} 
            size={'small'} 
            type={'primary'}
            danger>刪除</Button>
        )
    }

    return buttons
} 

const MemberTable = (props) => {
    const { 
        user, 
        members,
        isMemberLoading,

        onGetMembers,
        onStatusReject,
        onStatusApply,
        onRemoveMember,
        onReceiveMemberApply,
    } = props

    const query = useQuery()
    const id = query.get('id')

    useEffect(() => {
        let memberAddRef = null
        if (user && !(id && id !== user.uid)) {
            onGetMembers(user.uid)
            if (!memberAddRef) {
                memberAddRef = database.ref(`/users/${user.uid}/members`)
                memberAddRef.on('child_added', snapshot => {
                    const val = snapshot.val()
                    onReceiveMemberApply(val)
                })
            }
        }
        return () => {
            if (memberAddRef) {
                memberAddRef.off('child_added')
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    if (!user || (id && id !== user.uid)) {
        return null
    }

    const column = text => <span style={styles.column}>{text}</span>

    return (
        <div style={styles.table} >
            <h4>成員</h4>
            <Table 
                dataSource={members}
                loading={isMemberLoading}
                pagination={false}
                scroll={{ y: window.innerHeight / 2 }}
                style={styles.tableContent}
            >
                <Table.Column title={'姓名'} width={'180px'} dataIndex={'displayName'} key={'displayName'} render={(text, data) => (
                    <span style={styles.column}>
                        <Avatar 
                            icon={<UserOutlined />} 
                            alt={text} 
                            src={data.photoURL}
                        />
                        <strong style={styles.columnName}>{text}</strong>
                    </span>
                )}/>
                <Table.Column title={'狀態'} width={'100px'} dataIndex={'status'} key={'status'} render={status => {
                    return column(MEMBER_STATUS[status])
                }}/>
                <Table.Column title={'操作'} render={(_, data) => renderOperatorButton({
                    member: data, user, onStatusApply, onStatusReject, onRemoveMember,
                })}/>
            </Table>
        </div>
    )
}

MemberTable.propTypes = {
    user: PropTypes.object,
    members: PropTypes.array.isRequired,
    isMemberLoading: PropTypes.bool.isRequired,

    onGetMembers: PropTypes.func.isRequired,
    onStatusReject: PropTypes.func.isRequired,
    onStatusApply: PropTypes.func.isRequired,
    onRemoveMember: PropTypes.func.isRequired,
    onReceiveMemberApply: PropTypes.func.isRequired,
}

const mapState2Props = state => ({
    user: state.user,
    members: state.members,
    isMemberLoading: state.isMemberLoading,
})

const mapDispatch2Props = dispatch => ({
    onGetMembers: userId => dispatch(getMembers(userId)),
    onStatusReject: (userId, memberId) => dispatch(updateMemberStatus(userId, memberId, MEMBER_STATUS_REJECTED)),
    onStatusApply: (userId, memberId) => dispatch(updateMemberStatus(userId, memberId, MEMBER_STATUS_APPLIED)),
    onRemoveMember: (userId, memberId) => dispatch(removeMember(userId, memberId)),
    onReceiveMemberApply: member => dispatch(receiveMemberApply(member)),
})

export default connect(mapState2Props, mapDispatch2Props)(MemberTable)