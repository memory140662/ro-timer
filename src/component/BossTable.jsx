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

import { Table, Button } from 'antd'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { database } from '../common/api'

import PropTypes from 'prop-types'
import moment from 'moment-timezone'

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
} from '../common/actions'
import ConfirmDialog from './ConfirmDialog'
import { TIME_FORMAT } from '../common/constants'

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
  column: {
    color: '#000',
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
}

const useQuery = () => (new URLSearchParams(useLocation().search))

function BossTable(props) {
    const { 
      data,
      user, 
      isLoading,

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

      onDeleteBoss, 
      onKillBoss, 
      onGetAllBoss,
    } = props
    const tableRef = useRef()
    const [tableHeight, setTableHeight] = useState(0)
    const [search, setSearch] = useState(null)
    const [deleteBoss, setDeleteBoss] = useState(null)

    const query = useQuery()
    const id = query.get('id')

    useEffect(() => {
      let bossChangedRef = null
      let bossAddedRef = null
      let bossRemovedRef = null
      if (id) {
        onGetAllBoss(id)
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
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, id])
    
    useEffect(() => {
      if (!id && !user && data && data.length > 0) {
        onSave()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    useEffect(() => {
      if (!tableHeight && tableRef && tableRef.current) {
        setTableHeight(window.innerHeight - (tableRef.current.offsetTop + 50 + 10))
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableRef])

    const deleteHandler = (uid, bossKey) => {
      if (uid) {
        onDeleteBoss(uid, bossKey)
      } else {
        onDelete(bossKey)
      }
    }

    const killHandler = (uid, bossKey) => {
      if (uid) {
        onKillBoss(uid, bossKey)
      } else {
        onKill(bossKey)
      }
    }

    const column = text => <span style={styles.column}>{text}</span>

    const isEditable = !id || (user && user.uid === id)

    return (
        <>
          <style>{` 
              .rowColor1 {
                background: #f5f5f5;
              }
          `}</style>
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
            {isEditable ? <EButton 
              size={'large'}
              icon={'plus'} 
              onClick={onCreateDialogVisible}
              style={styles.createButton}>新增</EButton> : null}
          </div>
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
                <Table.Column align={'center'} title={'死亡時間'} dataIndex={'dealTime'} key={'dealTime'} width={120} render={column}/>
                <Table.Column 
                  align={'center'} 
                  title={'重生時間'} 
                  dataIndex={'nextTime'} 
                  key={'nextTime'} 
                  width={120} 
                  render={column}
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
                    
                    if (moment(a.nextTime, TIME_FORMAT).isBefore(moment(b.nextTime, TIME_FORMAT))) {
                      return -1
                    }

                    return 1
                  }}
                />
                <Table.Column title={'冷卻時間(分鐘)'} dataIndex={'cd'} key={'cd'} width={150} render={column}/>
                <Table.Column align={'center'} dataIndex={'randomTime'} key={'randomTime'} width={65} render={(_, data) => (
                  <Button
                    size={'middle'}
                    shape={'circle'} 
                    disabled={!isEditable}
                    type={isEditable ? null : 'link'}
                    onClick={() => onOpenRandomDialog(data)} 
                    style={isEditable ? styles.randomButton : styles.randomButtonDisable}
                  >{data.randomTime || 0}</Button>
                )}/>
                <Table.Column title={'操作'} dataIndex={'opt'} key={'opt'} width={320} render={(_, data) => (
                  isEditable ? 
                  <>
                    <EButton icon={'check'} type={'success'} onClick={() => killHandler(user && user.uid, data.key)}>擊殺</EButton>
                    <EButton icon={'edit'} type={'info'} onClick={() => onEdit(data.key)}>編輯</EButton>
                    <EButton icon={'delete'} type={'danger'} onClick={() => setDeleteBoss(data)}>刪除</EButton>
                  </>
                  : null
                )}/>
              </Table>
            </DndProvider>
            <ConfirmDialog 
              title={deleteBoss ? deleteBoss.name : null}
              visible={!!deleteBoss}
              message={() => (
                <div style={styles.confirmDialogMessage}>
                  是否刪除 <strong>{deleteBoss ? deleteBoss.name : null}</strong> ?
                </div>
              )} 
              onCancel={() => setDeleteBoss(null)}
              onConfirm={() => deleteHandler(user && user.uid, deleteBoss.key)}
            />
          </div>
        </>
    )
}

BossTable.propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,

    onLoad: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onKill: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    
    onCheckLocal: PropTypes.func.isRequired,
    onCreateDialogVisible: PropTypes.func.isRequired,
    onReceiveBossChanged: PropTypes.func.isRequired,
    onOpenRandomDialog: PropTypes.func.isRequired,
    
    onDeleteBoss: PropTypes.func.isRequired,
    onKillBoss: PropTypes.func.isRequired,
    onGetAllBoss: PropTypes.func.isRequired,
}

const mapState2Props = state => ({
    data: state.data,
    user: state.user,
    isLoading: state.isLoading,
    currentBoss: state.currentBoss,
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
    onOpenRandomDialog: (boss) => dispatch(setRandomBoss(boss)),
    
    onDeleteBoss: (userId, bossKey)=> dispatch(deleteBoss(userId, bossKey)),
    onKillBoss: (userId, bossKey) => dispatch(killBoss(userId, bossKey)),
    onGetAllBoss: (userId) => dispatch(getAllBoss(userId)),
    
})

export default connect(mapState2Props, mapDispatch2Props)(BossTable)