import React, { useState, useMemo, useEffect } from 'react'
import { Card, Input, Tabs } from 'antd'
import { Search } from 'react-feather';
import debounce from 'lodash.debounce'

import AllTokenLockList from '../../components/LPAndTokenLocker/TokenLocker/AllTokenLockList';
import MyTokenLockList from '../../components/LPAndTokenLocker/TokenLocker/MyTokenLockList';
import Disclaimer from '../../components/LPAndTokenLocker/Disclaimer';
import { useTranslation } from 'react-i18next';


function TokenLockList() {

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


    useEffect(() => {
        return () => {
            debouncedResults.cancel()
        }
    })
    return (
        <div className='mb-5'>
            {/* <h2 className='text-center mt-4 mb-4 primary-text'>Token Lock List</h2> */}

            <Card className='kingsale-card-bg mt-5'>

                <div className='mb-4'>
                    <Input
                        lang='en'
                        onChange={debouncedResults}
                        size="large"
                        placeholder={t('Search by token address...')}
                        prefix={<Search size={15} />} />
                </div>

                <Tabs defaultActiveKey="1" onChange={onChange}>
                    <TabPane tab={t("All")} key="1">
                        <AllTokenLockList searchKey={searchKey} />
                    </TabPane>
                    <TabPane tab={t("My lock")} key="2">
                        <MyTokenLockList searchKey={searchKey} />
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    )
}

export default TokenLockList