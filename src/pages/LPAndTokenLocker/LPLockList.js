import React, { useState, useMemo, useEffect } from 'react'
import { Card, Input, Tabs } from 'antd'
import { Search } from 'react-feather';
import debounce from 'lodash.debounce'

import AllLPLockList from '../../components/LPAndTokenLocker/LPLocker/AllLPLockList'
import MyLPLockList from '../../components/LPAndTokenLocker/LPLocker/MyLPLockList'
import Disclaimer from '../../components/LPAndTokenLocker/Disclaimer';
import { useTranslation } from 'react-i18next';


function LPLockList() {

    const { t } = useTranslation();
    const { TabPane } = Tabs;
    const [searchKey, setSearchKey] = useState('')

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const onChange = (key) => {
        console.log(key);
    };

    const handleSearchChange = (e) => {
        setSearchKey(e.target.value)
    }

    const debouncedResults = useMemo(() => {
        return debounce(handleSearchChange, 300);
    }, [])


    return (
        <div className='mb-5'>
            {/* <h2 className='text-center mt-4 mb-4 primary-text'>Liquidity Lock List</h2> */}

            <Card className='kingsale-card-bg mt-5'>

                <div className='mb-4'>
                    <Input
                        lang='en'
                        onChange={debouncedResults}
                        size="large"
                        placeholder={t('Search by LP token address or token address...')}
                        prefix={<Search size={15} />} />
                </div>

                <Tabs defaultActiveKey="1" onChange={onChange}>
                    <TabPane tab="All" key="1">
                        <AllLPLockList searchKey={searchKey} />
                    </TabPane>
                    <TabPane tab="My lock" key="2">
                        <MyLPLockList searchKey={searchKey} />
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    )
}

export default LPLockList