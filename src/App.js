import React from 'react'

import asyncComponent from './hoc/asyncComponent'

import BossTable from './component/BossTable'

import {
  Layout,
} from 'antd'
import MainHeader from './component/MainHeader'

const CreateBossDialog = asyncComponent(import('./component/CreateBossDialog'))
const Local2CloudDialog = asyncComponent(import('./component/Local2CloudDialog'))

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
