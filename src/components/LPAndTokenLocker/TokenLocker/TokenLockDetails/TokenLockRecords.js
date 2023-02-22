import React, { useEffect, useState } from 'react'
import { Table, Pagination, Card, Spin } from 'antd'
import { Link } from 'react-router-dom';
import { getEllipsisTxt } from '../../../../helpers/Formatters'
import axios from 'axios';
import { DateTime } from "luxon"
import { useTranslation } from 'react-i18next';

function TokenLockRecords(props) {
    const { Column } = Table;

    const { tokenAddress, isTokenDetailsLoading } = props
    // pagination related data
    const [currentPage, setCurrentPage] = useState(1) // current active page number
    const [totalRecords, setTotalRecords] = useState(1) // total number of records
    const [pagesize, setPageSize] = useState(15) // records count per page
    const [isTokenLockRecordsLoading, setIsTokenLockRecordsLoading] = useState(false)
    const [tokenLockRecords, setTokenLockRecords] = useState([])
    const { t } = useTranslation();

    const fetchTokenLockRecordsByTokenAddress = async () => {
        setIsTokenLockRecordsLoading(true)
        try {
            const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/v1/token-locker/get-token-lock-records/${tokenAddress}?page=${currentPage}&limit=${pagesize}`
            const response = await axios.get(endpoint)
            if (response && response.status === 200) {
                const tokenDetailsResponse = response.data.payload
                setTokenLockRecords(tokenDetailsResponse.items)
                const paginationDetails = response.data.payload.meta
                setTotalRecords(paginationDetails.itemCount)
            } else {
                setTokenLockRecords([])
                setTotalRecords(0)
            }
            setIsTokenLockRecordsLoading(false)
        } catch (error) {
            setIsTokenLockRecordsLoading(false)
            setTokenLockRecords([])
            setTotalRecords(0)
            console.error("ERROR while fetching token lock records by token address ", error)
        }
    }

    useEffect(() => {
        fetchTokenLockRecordsByTokenAddress()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenAddress])

    const onChange = (page) => {
        setCurrentPage(page);
    };

    const onChangePageSize = (current, size) => {
        setPageSize(size)
    }

    return (
        <Card title={<h5>Lock Records</h5>} className='kingsale-card-bg'>
            {
                isTokenDetailsLoading ? (
                    <div className='d-flex justify-content-center loader'>
                        <Spin size='medium' />
                    </div>
                ) : (
                    <div className='table'>
                        <div className='table-responsive'>
                            <Table
                                loading={isTokenLockRecordsLoading}
                                dataSource={tokenLockRecords}
                                pagination={false}
                            >
                                <Column
                                    title={t("Token")}
                                    render={
                                        (_, record) => (<a href={`${process.env.REACT_APP_BLOCK_EXPLORER}address/${record?.tokenAddress}`}>{getEllipsisTxt(record?.tokenAddress, 5)}</a>)}
                                />
                                <Column title={t("Amount")}
                                    render={
                                        (_, record) => (
                                            <div>
                                                {record?.lockedTokenAmount}
                                            </div>
                                        )
                                    }
                                />
                                <Column title={t("Cycle(days)")}
                                    render={
                                        (_, record) => (
                                            <div>
                                                {record.releaseCycles ? record.releaseCycles : "-"}
                                            </div>
                                        )
                                    }
                                />
                                <Column title={t("Initial Vesting Release(%)")}
                                    render={
                                        (_, record) => (
                                            <div>
                                                {record.initialVestingReleasePercentage ? record.initialVestingReleasePercentage : "-"}
                                            </div>
                                        )
                                    } />
                                <Column title={t("Vesting Release Cycle(%)")}
                                    render={
                                        (_, record) => (
                                            <div>
                                                {record.vestingCycleReleasePercentage ? record.vestingCycleReleasePercentage : "-"}
                                            </div>
                                        )
                                    }
                                />
                                <Column title={t("Unlock time(UTC)")}
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
                                            <Link to={`/token-lock/record/${record.transactionHash}`}>View</Link>
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
                )
            }
        </Card>
    )
}

export default TokenLockRecords