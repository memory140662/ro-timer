import React from 'react'

import asyncComponent from './hoc/asyncComponent'
import errorNotification from './hoc/errorNotification'

import BossTable from './component/BossTable'

import {
  Layout,
} from 'antd'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'

import MainHeader from './component/MainHeader'

const CreateBossDialog = asyncComponent(import('./component/CreateBossDialog'))
const Local2CloudDialog = asyncComponent(import('./component/Local2CloudDialog'))
const EditBossDialog = asyncComponent(import('./component/EditBossDialog'))
const RandomDialog = asyncComponent(import('./component/RandomDialog'))

const styles = {
  content: {
    minHeight: window.innerHeight - 64,
  },
}

const { Content } = Layout
function App() {
  return (
    <Router>
      <Switch>
        <Route path={['/:id', '/']}>
          <Layout className='layout'>
            <MainHeader />
            <Content style={styles.content}>
              <CreateBossDialog />
              <BossTable />
              <Local2CloudDialog />
              <EditBossDialog /> 
              <RandomDialog /> 
            </Content>
          </Layout>
          </Route>
      </Switch>
    </Router>
  )
}

export default errorNotification(App)
