import React from 'react'

import {
    Layout,
    Row,
    Col,
    Spin,
} from 'antd'

import BossTable from './BossTable'
import MemberTable from './MemberTable'
import asyncComponent from '../hoc/asyncComponent'
import { connect } from 'react-redux'

const { Content } = Layout

const CreateBossDialog = asyncComponent(import('./CreateBossDialog'))
const Local2CloudDialog = asyncComponent(import('./Local2CloudDialog'))
const EditBossDialog = asyncComponent(import('./EditBossDialog'))
const RandomDialog = asyncComponent(import('./RandomDialog'))
const NextTimeDialog = asyncComponent(import('./NextTimeDialog'))

const styles = {
    content: {
        minHeight: window.innerHeight - 64,
    },
}

const MainContent = (props) => {
    const { isConfigLoading } = props
    
    return (
        <Spin size={'large'} spinning={isConfigLoading}>
            <Content style={styles.content}>
                <Row gutter={16}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={16} xxl={16}><BossTable /></Col>
                    <Col xs={0} sm={0} md={0} lg={0} xl={8} xxl={4}><MemberTable/></Col>
                </Row>
                <CreateBossDialog />
                <Local2CloudDialog />
                <EditBossDialog /> 
                <RandomDialog /> 
                <NextTimeDialog /> 
            </Content>
        </Spin>
    )
}

const mapState2Props = state => ({
    isConfigLoading: state.isConfigLoading,
})

export default connect(mapState2Props)(MainContent)