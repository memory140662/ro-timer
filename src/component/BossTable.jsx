import React, {
    useState,
    useEffect,
    useRef,
} from 'react'
import { connect } from 'react-redux'

import {
    Input,
    Button as EButton,
} from 'element-react/next'

import { useLocation } from 'react-router-dom'

import { Table, Button, message, Modal, Tooltip } from 'antd'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { database } from '../common/api'

import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import { QuestionCircleOutlined } from '@ant-design/icons'

import { 
  load,
  edit,
  deleteBoss,
  getAllBoss,
  killBoss,
  startLoading,
  save,
  kill,
  deleteLocal,
  checkLocal,
  setCreateDialogVisible,
  receiveBossChanged,
  receiveBossAdded,
  receiveBossRemove,
  setRandomBoss,
  applyMember,
  checkMemberStatus,
  setMemberStatus,
  update,
  updateBoss,
  setNextTimeBoss,
} from '../common/actions'
import { TIME_FORMAT, MEMBER_STATUS_PENDING, MEMBER_STATUS_APPLIED } from '../common/constants'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const styles = {
  table: {
    alignSelf: 'center',
  },
  search: {
    width: 350,
    margin: 10,
  },
  tableOutside: {
    margin: 10,
  },
  createButton: {
    float: 'right', 
    margin: '10px',
  },
  randomButton: {
    color: '#000',
  },
  randomButtonDisable: {
    color: '#000',
    cursor: 'default',
  },
  confirmDialogMessage: {
    fontSize: '14px',
  },
  deleteDialog: { 
    color: 'red',
  },
  cellRadarIcon: {
    marginTop: '-3px',
    verticalAlign: 'middle',
  },
}

const useQuery = () => (new URLSearchParams(useLocation().search))

const renderSearchCol = (args) => {
  const { memberStatus, isApplyLoading, search, setSearch, isEditable, onCreateDialogVisible, editApplyHandler, user, isMemberStatusChecking } = args
  const addButton = (
    <EButton 
      size={'large'}
      icon={'plus'} 
      onClick={onCreateDialogVisible}
      style={styles.createButton}
    >新增</EButton>
  )

  const applyButton = (
    <EButton
      disabled={isMemberStatusChecking || memberStatus === MEMBER_STATUS_PENDING}
      loading={isApplyLoading}
      size={'large'}
      icon={'information'}
      style={styles.createButton}
      onClick={() => editApplyHandler && editApplyHandler(user)}
    >{memberStatus === MEMBER_STATUS_PENDING ? '審核中' : '編輯申請'}</EButton>
  )

  return (
    <div>
      <Input
          value={search}
          placeholder={'查詢'}
          style={styles.search}
          onChange={e => setSearch(e)}
          icon={'close'}
          trim
          onIconClick={() => setSearch(null)}
      />
      {isEditable ?  addButton: applyButton}
    </div>
  )
}

function BossTable(props) {
    const { 
      data,
      user, 
      isLoading,
      applyResult,
      isApplyLoading,
      memberStatus,
      isMemberStatusChecking,

      onLoad,
      onEdit, 
      onSave,
      onKill,
      onDelete,
      onCheckLocal,
      onCreateDialogVisible,
      onReceiveBossChanged,
      onReceiveBossAdded,
      onReceiveBossRemoved,
      onOpenRandomDialog,
      onSetMemberStatus,
      onClear,
      onSetNextTimeBoss,

      onDeleteBoss, 
      onKillBoss, 
      onGetAllBoss,
      onApplyMember,
      onCheckMemberStatus,
      onClearBoss,
    } = props
    const tableRef = useRef()
    const [tableHeight, setTableHeight] = useState(0)
    const [search, setSearch] = useState(null)

    const query = useQuery()
    const id = query.get('id')

    useEffect(() => {
      let bossChangedRef = null
      let bossAddedRef = null
      let bossRemovedRef = null
      let memberStatusRef = null
      if (id) {
        if (!user) {
          onGetAllBoss(id)
        } else {
          onCheckMemberStatus(id, user.uid)
          if (!memberStatusRef) {
            memberStatusRef = database.ref(`/users/${id}/members/${user.uid}`)
            memberStatusRef.on('value', snapshot => {
              if (snapshot.exists()) {
                const val = snapshot.child('status').val()
                onSetMemberStatus(val)
              } else {
                onSetMemberStatus('')
              }
            })
          }
        }
        if (!bossChangedRef) {
          bossChangedRef = database.ref(`/users/${id}/bosses`)
          bossChangedRef.on('child_changed', snapshot => {
            const val = snapshot.val()
            onReceiveBossChanged(val)
          })
        }
        if (!bossAddedRef) {
          bossAddedRef = database.ref(`/users/${id}/bosses`)
          bossAddedRef.on('child_added', snapshot => {
            const val = snapshot.val()
            onReceiveBossAdded(val)
          })
        }
        if (!bossRemovedRef) {
          bossRemovedRef = database.ref(`/users/${id}/bosses`)
          bossRemovedRef.on('child_removed', snapshot => {
            const val = snapshot.val()
            onReceiveBossRemoved(val)
          })
        }
      } else {
        if (user) {
          onCheckLocal()
          onGetAllBoss(user.uid)
          if (!bossChangedRef) {
            bossChangedRef = database.ref(`/users/${user.uid}/bosses`)
            bossChangedRef.on('child_changed', snapshot => {
              const val = snapshot.val()
              onReceiveBossChanged(val)
            })
          }
          if (!bossAddedRef) {
            bossAddedRef = database.ref(`/users/${user.uid}/bosses`)
            bossAddedRef.on('child_added', snapshot => {
              const val = snapshot.val()
              onReceiveBossAdded(val)
            })
          }
          if (!bossRemovedRef) {
            bossRemovedRef = database.ref(`/users/${user.uid}/bosses`)
            bossRemovedRef.on('child_removed', snapshot => {
              const val = snapshot.val()
              onReceiveBossRemoved(val)
            })
          }
        } else {
          onLoad()
        }
      }
      return () => {
        if (bossChangedRef) {
          bossChangedRef.off('child_changed')
        }
        if (bossAddedRef) {
          bossAddedRef.off('child_added')
        }
        if (bossRemovedRef) {
          bossRemovedRef.off('child_removed')
        }
        if (memberStatusRef) {
          memberStatusRef.off('child_changed')
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, id])
    
    useEffect(() => {
      if (!id && !user) {
        onSave()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    useEffect(() => {
      if (!tableHeight && tableRef && tableRef.current) {
        setTableHeight(window.innerHeight - (tableRef.current.offsetTop + 50 + 65))
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableRef])

    useEffect(() => {
      if (applyResult) {
        if (applyResult instanceof Error) {
          message.error('申請提交中！請勿重複申請。')
        } else {
          message.success('申請已提交，待審核中。')
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [applyResult])

    const deleteHandler = (uid, boss) => {
      Modal.confirm({
        title: '刪除確認！',
        icon: <ExclamationCircleOutlined style={styles.deleteDialog} />,
        content: `是否刪除 ${boss.name} ？`,
        okText: '刪除',
        cancelText: '取消',
        okType:'danger',
        onOk() {
          if (uid) {
            onDeleteBoss(uid, boss.key)
          } else {
            onDelete(boss.key)
          }
        },
      })
      
    }

    const killHandler = (uid, bossKey) => {
      if (uid) {
        onKillBoss(uid, bossKey)
      } else {
        onKill({ key: bossKey })
      }
    }

    const editApplyHandler = (user) => {
      if (!user) {
        message.error('請先登入！')
        return
      }
      if (user.uid === id) {
        message.error('使用者與申請者不能為同一人!')
        return
      }

      if (memberStatus === MEMBER_STATUS_PENDING) {
        message.error('申請提交中！請勿重複申請。')
        return
      }

      onApplyMember(id, user)
    }

    const clearHandler = (uid, boss) => {
      Modal.confirm({
        title: '清除確認！',
        icon: <ExclamationCircleOutlined />,
        content: `是否清除 ${boss.name} 擊殺時間及重生時間？`,
        okText: '清除',
        cancelText: '取消',
        onOk() {
          if (uid) {
            onClearBoss(uid, boss.key)
          } else {
            onClear(boss.key)
          }
        },
      })
    }

    const column = text => <span>{text}</span>

    const isEditable = (!id || (user && user.uid === id)) || memberStatus === MEMBER_STATUS_APPLIED

    return (
        <>
          <style>{` 
              .rowColor1 {
                background: #f5f5f5;
              }
              td.ant-table-cell {
                color: #000;
              }
          `}</style>
          {renderSearchCol({
            memberStatus,
            isApplyLoading,
            search, 
            setSearch, 
            isEditable, 
            onCreateDialogVisible, 
            editApplyHandler,
            user,
            isMemberStatusChecking,
          })}
          <div style={styles.tableOutside} ref={tableRef}>
            <DndProvider backend={HTML5Backend}>
              <Table
                size={'middle'}
                bordered
                rowClassName={(_, idx) => (
                  idx % 2 === 0 ? null : 'rowColor1'
                )}
                loading={isLoading}
                style={{...styles.table}}
                dataSource={data.filter(d => d.name && (!search || d.name.indexOf(search) !== -1))}
                pagination={false}
                scroll={{ y: tableHeight }}
              >
                <Table.Column title={'名稱'} dataIndex={'name'} key={'name'} width={100} render={column} />
                <Table.Column align={'center'} title={'死亡時間'} dataIndex={'dealTime'} key={'dealTime'} width={100} 
                  render={ dealTime => (
                    (dealTime && dealTime.length > 5)
                    ? column(moment(new Date(dealTime)).format(TIME_FORMAT))
                    : dealTime
                  )}
                />
                <Table.Column 
                  align={'center'} 
                  title={'重生時間'} 
                  dataIndex={'nextTime'} 
                  key={'nextTime'} 
                  width={100} 
                  render={nextTime => (
                    (nextTime && nextTime.length > 5)
                    ? column(moment(new Date(nextTime)).format(TIME_FORMAT))
                    : nextTime
                  )}
                  sortDirections={['ascend']}
                  sorter={(a, b) => {
                    if (!a.nextTime && !b.nextTime) {
                      return 0
                    }

                    if (!b.nextTime) {
                      return -1
                    }

                    if (!a.nextTime) {
                      return 1
                    }
                    
                    if (moment(a.nextTime.length > 5 ? new Date(a.nextTime) : a.nextTime, a.nextTime.length > 5 ? undefined : TIME_FORMAT)
                        .isBefore(moment(b.nextTime.length > 5 ? new Date(b.nextTime) : b.nextTime, b.nextTime.length > 5 ? undefined : TIME_FORMAT))) {
                      return -1
                    }

                    return 1
                  }}
                />
                <Table.Column title={'CD'} align={'center'} dataIndex={'cd'} key={'cd'} width={60} render={column}/>
                <Table.Column 
                  title={() => (
                        <span>
                          {'雷達'}
                          <Tooltip title={'如果有使用雷達，按鈕邊框顯示為藍色。'}>
                            <QuestionCircleOutlined style={styles.cellRadarIcon}/>
                          </Tooltip>
                        </span>
                    )} 
                  align={'center'} 
                  dataIndex={'randomTime'} 
                  key={'randomTime'} 
                  width={70} 
                  render={(_, data) => (
                      <Button
                        size={'middle'}
                        shape={'circle'} 
                        disabled={!isEditable}
                        ghost={isEditable && !!data.isRadarUsed}
                        type={isEditable ? (!!data.isRadarUsed ? 'primary': null) : 'link'}
                        onClick={() => onOpenRandomDialog(data)} 
                        style={isEditable ? styles.randomButton : styles.randomButtonDisable}
                      >{data.randomTime || 0}</Button>
                    )}
                  />
                <Table.Column title={'操作'} dataIndex={'opt'} key={'opt'} width={488} render={(_, data) => (
                  isEditable ? 
                  <>
                    <EButton size={'small'} icon={'check'} type={'success'} onClick={() => killHandler(user && (id || user.uid), data.key)}>擊殺</EButton>
                    <EButton size={'small'} icon={'time'} type={'success'} onClick={() => onOpenRandomDialog(data, true)}>雷達擊殺</EButton>
                    <EButton size={'small'} icon={'edit'} type={'info'} onClick={() => onEdit(data.key)}>編輯</EButton>
                    <EButton size={'small'} icon={'delete'} type={'danger'} onClick={() => deleteHandler(user && (id || user.uid), data)}>刪除</EButton>
                    <EButton size={'small'} icon={'close'} onClick={() => clearHandler(user && (id || user.uid), data)}>清除</EButton>
                    <EButton size={'small'} icon={'caret-right'} type={'warning'} onClick={() => onSetNextTimeBoss(data.key)}>重生時間</EButton>
                  </>
                  : null
                )}/>
              </Table>
            </DndProvider>
          </div>
        </>
    )
}

BossTable.propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    applyResult: PropTypes.any,
    isApplyLoading: PropTypes.bool,
    memberStatus: PropTypes.string,
    isMemberStatusChecking: PropTypes.bool,

    onLoad: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onKill: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onCheckLocal: PropTypes.func.isRequired,
    onCreateDialogVisible: PropTypes.func.isRequired,
    onReceiveBossChanged: PropTypes.func.isRequired,
    onOpenRandomDialog: PropTypes.func.isRequired,
    onSetMemberStatus: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    onSetNextTimeBoss: PropTypes.func.isRequired,
    
    onDeleteBoss: PropTypes.func.isRequired,
    onKillBoss: PropTypes.func.isRequired,
    onGetAllBoss: PropTypes.func.isRequired,
    onApplyMember: PropTypes.func.isRequired,
    onCheckMemberStatus: PropTypes.func.isRequired,
    onClearBoss: PropTypes.func.isRequired,
}

const mapState2Props = state => ({
    data: state.data,
    user: state.user,
    isLoading: state.isLoading,
    currentBoss: state.currentBoss,
    applyResult: state.applyResult,
    isApplyLoading: state.isApplyLoading,
    memberStatus: state.memberStatus,
    isMemberStatusChecking: state.isMemberStatusChecking,
})

const mapDispatch2Props = dispatch => ({
    onLoad: () =>  dispatch(startLoading()) | dispatch(load()),
    onEdit: key => dispatch(edit(key)),
    onSave: () => dispatch(save()),
    onKill: key => dispatch(kill(key)),
    onDelete: key => dispatch(deleteLocal(key)),
    onCheckLocal: data => dispatch(checkLocal(data)),
    onCreateDialogVisible: () => dispatch(setCreateDialogVisible(true)),
    onReceiveBossChanged: boss => dispatch(receiveBossChanged(boss)),
    onReceiveBossAdded: boss => dispatch(receiveBossAdded(boss)),
    onReceiveBossRemoved: boss => dispatch(receiveBossRemove(boss)),
    onOpenRandomDialog: (boss, isRadarKill) => dispatch(setRandomBoss({ boss, isRadarKill })),
    onSetMemberStatus: status => dispatch(setMemberStatus(status)),
    onClear: key => dispatch(update({key, dealTime: null, isRadarUsed: false })),
    onSetNextTimeBoss: key => dispatch(setNextTimeBoss(key)),
    
    onDeleteBoss: (userId, bossKey)=> dispatch(deleteBoss(userId, bossKey)),
    onKillBoss: (userId, bossKey) => dispatch(killBoss(userId, bossKey)),
    onGetAllBoss: (userId) => dispatch(getAllBoss(userId)),
    onApplyMember: (userId, applyUser) => dispatch(applyMember(userId, applyUser)),
    onCheckMemberStatus: (userId, applyUserId) => dispatch(checkMemberStatus(userId, applyUserId)),
    onClearBoss: (userId, bossKey) => dispatch(updateBoss(userId, bossKey, { dealTime: null, isRadarUsed: false })),
})

export default connect(mapState2Props, mapDispatch2Props)(BossTable)