import React from 'react'

import errorNotification from './hoc/errorNotification'
import loadConfig from './hoc/loadConfig'

import {
  Layout,
} from 'antd'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'

import MainHeader from './component/MainHeader'
import MainContent from './component/MainContent'

function App() {
  return (
    <Router>
      <Switch>
        <Layout className='layout'>
          <MainHeader />
          <Route>
            <MainContent />
          </Route>
        </Layout>
      </Switch>
    </Router>
  )
}

export default errorNotification(loadConfig(App))
