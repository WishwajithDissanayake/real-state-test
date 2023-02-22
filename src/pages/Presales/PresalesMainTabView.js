import React, { useEffect } from 'react'
import { Tabs } from 'antd';
import PresalesList from './PresalesList'
import MyPresales from './MyPresales';
import PresalesAdvanced from './PresalesAdvanced';
import LikedPresales from './LikedPresales';
import { useTranslation } from 'react-i18next';
import MyContributedPresales from './MyContributedPresales';

function PresalesMainTabView() {

    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className='mt-3 mb-3 container mx-auto'>
            <Tabs size='small' centered defaultActiveKey="1">
                <Tabs.TabPane tab={t("All Presales")} key="1">
                    <PresalesList />
                </Tabs.TabPane>
                <Tabs.TabPane tab={t("Overview")} key="2">
                    <PresalesAdvanced />
                </Tabs.TabPane>
                <Tabs.TabPane tab={t("My Contributions")} key="3">
                    <MyContributedPresales />
                </Tabs.TabPane>
                <Tabs.TabPane tab={t("All Liked")} key="4">
                    <LikedPresales />
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default PresalesMainTabView