import React from 'react'

import CreateBossForm from './component/CreateBossForm'
import BossTable from './component/BossTable'
import Local2CloudDialog from './component/Local2CloudDialog'
import {
  Layout,
} from 'antd'
import MainHeader from './component/MainHeader'

const { Content } = Layout
function App() {
  return (
    <Layout className='layout'>
      <MainHeader />
      <Content>
        <CreateBossForm />
        <BossTable />
        <Local2CloudDialog />
      </Content>
    </Layout>
  )
}

export default App
