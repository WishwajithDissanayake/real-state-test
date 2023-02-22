import React, { useState, useEffect } from 'react'
import { Table, Pagination } from 'antd'
import bsc from '../../../images/bsc.png'
import coin from '../../../images/coin.png'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'react-feather'

function MyTokenLockList(props) {

    const { Column } = Table;
    const { searchKey } = props
    // pagination related data
    const [currentPage, setCurrentPage] = useState(1)
    const [totalRecords, setTotalRecords] = useState(1)
    const [pagesize, setPageSize] = useState(10)
    const [liquidityLockList, setLiquidityLockList] = useState([])
    const [isLiquidityLockListLoading, setIsLiquidityLockListLoading] = useState(false)

    const { account } = useWeb3React()
    const { t } = useTranslation();


    const fetchMyLiquidityLockList = async () => {
        setIsLiquidityLockListLoading(true)
        try {
            const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/v1/liquidity-locker/get-lock-records/user/${account}?page=${currentPage}&limit=${pagesize}&search=${searchKey}`
            const response = await axios.get(endpoint)
            if (response && response.status === 200) {
                const paginationDetails = response.data.payload.meta
                setTotalRecords(paginationDetails.itemCount)
                const tokenListResponse = response.data.payload.items
                console.log("tokenListResponse", tokenListResponse)
                setLiquidityLockList(tokenListResponse)
            } else {
                setLiquidityLockList([])
            }
            setIsLiquidityLockListLoading(false)
        } catch (error) {
            console.error("ERROR while fetching locked token list from the API ", error)
            setIsLiquidityLockListLoading(false)
            setLiquidityLockList([])
        }
    }

    useEffect(() => {
        if (account) {
            fetchMyLiquidityLockList()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, searchKey])

    const itemRender = (_, type, originalElement) => {
        if (type === 'prev') {
          return <a><ChevronLeft className='pagination-arrows' /></a>;
        }
        if (type === 'next') {
          return <a><ChevronRight className='pagination-arrows' /></a>;
        }
        return originalElement;
    };

    const onChange = (page) => {
        setCurrentPage(page);
    };

    const onChangePageSize = (current, size) => {
        setPageSize(size)
    }


    return (
        <div className='table'>
            <div className='table-responsive'>
                <Table
                    loading={isLiquidityLockListLoading}
                    dataSource={liquidityLockList}
                    pagination={false}
                >
                    <Column
                        title={t("Liquidity token")}
                        render={
                            (_, record) => (
                                <div className='d-md-flex'>
                                    <div>
                                        <img src={bsc} alt="token" style={{ width: '20px' }} />
                                        <img src={coin} alt="coin" style={{ width: '22px', marginRight: '10px', marginLeft: '-10px' }} />
                                    </div>

                                    <div>
                                        <span>
                                            {record.title ? record.title : record.tokenLock.tokenName}
                                        </span><br />
                                        <span className='small text-muted'>
                                            {record.tokenLock.tokenName} - {record.tokenLock.tokenSymbol}
                                        </span>
                                    </div>
                                </div>
                            )
                        }
                    />
                    <Column title={t("Amount")} dataIndex="lockedTokenAmount" key="transactionHash" />
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
                        showSizeChanger
                        onShowSizeChange={onChangePageSize}
                        total={totalRecords} 
                        itemRender={itemRender}
                        />
                </div>
            </div>
        </div>
    )
}

export default MyTokenLockList