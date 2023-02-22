import React, { useState, useEffect } from 'react'
import { Table, Pagination, Card } from 'antd'
import { Link } from 'react-router-dom';
import { getEllipsisTxt } from '../../../../helpers/Formatters'
import axios from 'axios';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

function LPLockRecords(props) {

    const { Column } = Table
    const { pairAddress } = props

    const [currentPage, setCurrentPage] = useState(1) // current active page number
    const [totalRecords, setTotalRecords] = useState(1) // total number of records
    const [pagesize, setPageSize] = useState(15) // records count per page
    const [isLiquidityLockRecordsLoading, setIsLiquidityLockRecordsLoading] = useState(false)
    const [liquidityLockRecords, setLiquidityLockRecords] = useState([])
    const { t } = useTranslation();

    const fetchLiquidityLockRecordsByTokenAddress = async () => {
        setIsLiquidityLockRecordsLoading(true)
        try {
            const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/v1/liquidity-locker/get-token-lock-records/${pairAddress}?page=${currentPage}&limit=${pagesize}`
            const response = await axios.get(endpoint)
            if (response && response.status === 200) {
                const liquidityDetailsResponse = response.data.payload
                setLiquidityLockRecords(liquidityDetailsResponse.items)
                const paginationDetails = response.data.payload.meta
                setTotalRecords(paginationDetails.itemCount)
            } else {
                setLiquidityLockRecords([])
                setTotalRecords(0)
            }
            setIsLiquidityLockRecordsLoading(false)
        } catch (error) {
            setIsLiquidityLockRecordsLoading(false)
            setLiquidityLockRecords([])
            setTotalRecords(0)
            console.error("ERROR while fetching liquidity lock records by token address ", error)
        }
    }

    useEffect(() => {
        fetchLiquidityLockRecordsByTokenAddress()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pairAddress])

    const onChange = (page) => {
        setCurrentPage(page);
    };

    const onChangePageSize = (current, size) => {
        setPageSize(size)
    }

    return (
        <Card title={<h5>{t('Lock Records')}</h5>} className='kingsale-card-bg'>

            <div className='table'>
                <div className='table-responsive'>
                    <Table
                        loading={isLiquidityLockRecordsLoading}
                        dataSource={liquidityLockRecords}
                        pagination={false}
                    >
                        <Column
                            title={t('Token')}
                            render={
                                (_, record) => (<a href={`${process.env.REACT_APP_BLOCK_EXPLORER}address/${record?.tokenAddress}`}>{getEllipsisTxt(record?.tokenAddress, 5)}</a>)}
                        />
                        <Column title={t('Amount')}
                            render={
                                (_, record) => (
                                    <div>
                                        {record?.lockedTokenAmount}
                                    </div>
                                )
                            }
                        />
                        <Column title={t('Cycle(days)')}
                            render={
                                (_, record) => (
                                    <div>
                                        {record.releaseCycles ? record.releaseCycles : "-"}
                                    </div>
                                )
                            }
                        />
                        <Column title={t('Initial Vesting Release(%)')}
                            render={
                                (_, record) => (
                                    <div>
                                        {record.initialVestingReleasePercentage ? record.initialVestingReleasePercentage : "-"}
                                    </div>
                                )
                            } />
                        <Column title={t('Vesting Release Cycle(%)')}
                            render={
                                (_, record) => (
                                    <div>
                                        {record.vestingCycleReleasePercentage ? record.vestingCycleReleasePercentage : "-"}
                                    </div>
                                )
                            }
                        />
                        <Column title={t('Unlock time(UTC)')}
                            render={
                                (_, record) => (
                                    <div>
                                        {record.unlockTime ? DateTime.fromISO(record.unlockTime).toFormat("yyyy-LL-dd HH:mm:ss") : "-"}
                                    </div>
                                )
                            } />
                        <Column
                            render={
                                (_, record) => (
                                    <Link to={`/liquidity-lock/record/${record.transactionHash}`}>View</Link>
                                )
                            }
                        />
                    </Table>

                    <div className='d-flex justify-content-center mt-4'>
                        <Pagination
                            current={currentPage}
                            pageSize={pagesize}
                            pageSizeOptions={["15", "30", "60", "90"]}
                            onChange={onChange}
                            onShowSizeChange={onChangePageSize}
                            total={totalRecords}
                        />
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default LPLockRecords