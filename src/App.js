import React from 'react'

import CreateBossDialog from './component/CreateBossDialog'
import BossTable from './component/BossTable'
import Local2CloudDialog from './component/Local2CloudDialog'
import {
  Layout,
} from 'antd'
import MainHeader from './component/MainHeader'

const styles = {
  content: {
    minHeight: window.innerHeight - 64
  }
}

const { Content } = Layout
function App() {
  return (
    <Layout className='layout'>
      <MainHeader />
      <Content style={styles.content}>
        <CreateBossDialog />
        <BossTable />
        <Local2CloudDialog />
      </Content>
    </Layout>
  )
}

export default App
