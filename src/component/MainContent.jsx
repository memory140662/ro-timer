import React from 'react'

import {
    Layout,
    Row,
    Col,
} from 'antd'

import BossTable from './BossTable'
import asyncComponent from '../hoc/asyncComponent'

const { Content } = Layout

const CreateBossDialog = asyncComponent(import('./CreateBossDialog'))
const Local2CloudDialog = asyncComponent(import('./Local2CloudDialog'))
const EditBossDialog = asyncComponent(import('./EditBossDialog'))
const RandomDialog = asyncComponent(import('./RandomDialog'))

const styles = {
    content: {
        minHeight: window.innerHeight - 64,
    },
}

const MainContent = () => {
    return (
        <Content style={styles.content}>
            <Row gutter={16}>
                <Col xs={24} sm={24} md={24} lg={20} xl={16} xxl={16}><BossTable /></Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={8} xxl={4}>
                </Col>
            </Row>
            <CreateBossDialog />
            <Local2CloudDialog />
            <EditBossDialog /> 
            <RandomDialog /> 
        </Content>
    )
}

export default MainContent