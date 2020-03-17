import React, {
    useState,
    useEffect,
    useRef,
} from 'react'
import { connect } from 'react-redux'

import {
    Input,
    Button
} from 'element-react/next'

import { useLocation } from 'react-router-dom'

import { Table } from 'antd'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import update from 'immutability-helper'
import { database } from '../common/api'

import PropTypes from 'prop-types'

import { 
  load,
  edit,
  deleteBoss,
  setBossRandomTime, 
  sortDate,
  getAllBoss,
  killBoss,
  startLoading,
  editCancel,
  updateBoss,
  save,
  kill,
  deleteLocal,
  editConfirm,
  setRandomTime,
  checkLocal,
  createDialogVisible,
  receiveBossChanged,
  receiveBossAdded,
  receiveBossRemove
} from '../common/actions'

import asyncComponent from '../hoc/asyncComponent'

const RandomDialog = asyncComponent(import('./RandomDialog'))
const EditBossDialog = asyncComponent(import('./EditBossDialog'))

const styles = {
  table: {
    width: 900,
  },
  search: {
    width: 350,
    margin: 10
  },
  tableOutside: {
    margin: 10,
  },
  column: {
    color: '#000',
  },
  createButton: {
    float: 'right', 
    margin: '10px'
  },
  randomButton: {
    width: '50px',
    color: '#000'
  },
  randomButtonDisable: {
    width: '50px',
    color: '#000'
  }
}

const type = 'DragbleBodyRow'

const DragableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
  const ref = React.useRef()
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const { index: dragIndex } = monitor.getItem() || {}
      if (dragIndex === index) {
        return {}
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      }
    },
    drop: item => {
      moveRow(item.index, index)
    },
  })
  const [, drag] = useDrag({
    item: { type, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })
  drop(drag(ref))
  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  )
}

// eslint-disable-next-line
const components = {
  body: {
    row: DragableBodyRow,
  },
}

const useQuery = () => (new URLSearchParams(useLocation().search))

function BossTable(props) {
    const { 
      data,
      user, 
      isLoading,
      currentBoss,

      onLoad,
      onSort, 
      onEdit, 
      onSave,
      onCancel,
      onKill,
      onEditConfirm,
      onDelete,
      onSetRandomTime,
      onCheckLocal,
      onCreateDialogVisible,
      onReceiveBossChanged,
      onReceiveBossAdded,
      onReceiveBossRemoved,

      onDeleteBoss, 
      onKillBoss, 
      onGetAllBoss,
      onUpdateBoss,
      onSetBossRandomTime, 
    } = props
    const tableRef = useRef()
    const [tableHeight, setTableHeight] = useState(0)
    const [search, setSearch] = useState(null)
    const [isShowDialog, setShowDialog] = useState(false)
    const [randomData, setRandomData] = useState({
      key: null,
      num: 0,
    })

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
        setTableHeight(window.outerHeight - tableRef.current.offsetTop - 170)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableRef])

    const onRandomClick = (key, num) => {
      setRandomData({key, num})
      setShowDialog(true)
    }

    const onChoiceCancel = () => {
      setShowDialog(false)
    }

    // eslint-disable-next-line
    const moveRow = (dragIndex, hoverIndex) => {
      const dragRow = data[dragIndex]
  
      onSort(update(data, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      }))
    }

    const deleteHandler = (uid, bossKey) => {
      if (uid) {
        onDeleteBoss(uid, bossKey)
      } else {
        onDelete(bossKey)
      }
    }

    const editHandler = (uid, bossKey, data) => {
      if (uid) {
        onUpdateBoss(uid, bossKey, data)
      } else {
        onEditConfirm({...data, key: bossKey})
      }
    }

    const killHandler = (uid, bossKey) => {
      if (uid) {
        onKillBoss(uid, bossKey)
      } else {
        onKill(bossKey)
      }
    }

    const setRandomTimeHandler = (uid, bossKey, num) => {
      if (uid) {
        onSetBossRandomTime(uid, bossKey, num)
      } else {
        onSetRandomTime({num, key: bossKey})
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
          <div style={styles.table}>
            <Input
                value={search}
                placeholder={'查詢'}
                style={styles.search}
                onChange={e => setSearch(e)}
                icon={'close'}
                trim
                onIconClick={() => setSearch(null)}
            />
            {isEditable ? <Button 
              size={'large'}
              icon={'plus'} 
              onClick={onCreateDialogVisible}
              style={styles.createButton}>新增</Button> : null}
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
                // components={components}
                // onRow={(_, index) => ({
                //   index,
                //   moveRow: moveRow,
                // })}
                pagination={false}
                scroll={{ y: tableHeight }}
              >
                <Table.Column title={'名稱'} dataIndex={'name'} key={'name'} width={100} render={column}/>
                <Table.Column align={'center'} title={'死亡時間'} dataIndex={'dealTime'} key={'dealTime'} width={120} render={column}/>
                <Table.Column align={'center'} title={'重生時間'} dataIndex={'nextTime'} key={'nextTime'} width={120} render={column}/>
                <Table.Column title={'冷卻時間(分鐘)'} dataIndex={'cd'} key={'cd'} width={150} render={column}/>
                <Table.Column dataIndex={'randomTime'} key={'randomTime'} width={65} render={(_, data) => (
                  <Button 
                    disabled={!isEditable}
                    type={isEditable ? null : 'text'}
                    onClick={() => onRandomClick(data.key, data.randomTime)} 
                    style={isEditable ? styles.randomButton : styles.randomButtonDisable}
                  >{data.randomTime || 0}</Button>
                )}/>
                <Table.Column title={'操作'} dataIndex={'opt'} key={'opt'} width={320} render={(_, data) => (
                  isEditable ? 
                  <>
                    <Button icon={'check'} type={'success'} onClick={() => killHandler(user && user.uid, data.key)}>擊殺</Button>
                    <Button icon={'edit'} type={'info'} onClick={() => onEdit(data.key)}>編輯</Button>
                    <Button icon={'delete'} type={'danger'} onClick={() => deleteHandler(user && user.uid, data.key)}>刪除</Button>
                  </>
                  : null
                )}/>
              </Table>
            </DndProvider>
          </div>
          <RandomDialog 
            isShowDialog={isShowDialog} 
            onCancel={onChoiceCancel}
            onChoice={num => setRandomTimeHandler(user && user.uid, randomData.key, num)}
            choiceNum={randomData.num}
          />
          <EditBossDialog 
              boss={currentBoss}
              user={user}
              onCancel={onCancel}
              onUpdateBoss={editHandler}
          /> 
        </>
    )
}

BossTable.propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    currentBoss: PropTypes.object,

    onLoad: PropTypes.func.isRequired,
    onSort: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onKill: PropTypes.func.isRequired,
    onEditConfirm: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSetRandomTime: PropTypes.func.isRequired,
    onCheckLocal: PropTypes.func.isRequired,
    onCreateDialogVisible: PropTypes.func.isRequired,
    onReceiveBossChanged: PropTypes.func.isRequired,
    
    onDeleteBoss: PropTypes.func.isRequired,
    onKillBoss: PropTypes.func.isRequired,
    onGetAllBoss: PropTypes.func.isRequired,
    onUpdateBoss: PropTypes.func.isRequired,
    onSetBossRandomTime: PropTypes.func.isRequired,
}

const mapState2Props = state => ({
    data: state.data,
    user: state.user,
    isLoading: state.isLoading,
    currentBoss: state.currentBoss,
})

const mapDispatch2Props = dispatch => ({
    onLoad: () =>  dispatch(startLoading()) | dispatch(load()),
    onSort: data => dispatch(sortDate(data)),
    onEdit: key => dispatch(edit(key)),
    onSave: () => dispatch(save()),
    onCancel: () => dispatch(editCancel()),
    onKill: key => dispatch(kill(key)),
    onEditConfirm: data => dispatch(editConfirm(data)),
    onDelete: key => dispatch(deleteLocal(key)),
    onSetRandomTime: data => dispatch(setRandomTime(data)),
    onCheckLocal: data => dispatch(checkLocal(data)),
    onCreateDialogVisible: () => dispatch(createDialogVisible()),
    onReceiveBossChanged: boss => dispatch(receiveBossChanged(boss)),
    onReceiveBossAdded: boss => dispatch(receiveBossAdded(boss)),
    onReceiveBossRemoved: boss => dispatch(receiveBossRemove(boss)),
    
    onDeleteBoss: (userId, bossKey)=> dispatch(startLoading()) | dispatch(deleteBoss(userId, bossKey)),
    onKillBoss: (userId, bossKey) => dispatch(startLoading()) | dispatch(killBoss(userId, bossKey)),
    onGetAllBoss: (userId) => dispatch(startLoading()) |  dispatch(getAllBoss(userId)),
    onUpdateBoss: (userId, bossKey, data) => dispatch(startLoading()) | dispatch(updateBoss(userId, bossKey, data)),
    onSetBossRandomTime: (userId, bossKey, randomTime) => dispatch(startLoading()) |  dispatch(setBossRandomTime(userId, bossKey, randomTime)),
})

export default connect(mapState2Props, mapDispatch2Props)(BossTable)