import React, { useState, useEffect } from 'react'
import { Table, Pagination } from 'antd'
import bsc from '../../../images/bsc.png'
import coin from '../../../images/coin.png'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'react-feather'

function AllTokenLockList(props) {
    const { searchKey } = props
    const { Column } = Table
    const { t } = useTranslation();

    // pagination related data
    const [currentPage, setCurrentPage] = useState(1)
    const [totalRecords, setTotalRecords] = useState(1)
    const [pagesize, setPageSize] = useState(10)
    const [tokenList, setTokenList] = useState([])
    const [isTokenListLoading, setIsTokenListLoading] = useState(false)

    const itemRender = (_, type, originalElement) => {
        if (type === 'prev') {
          return <a><ChevronLeft className='pagination-arrows' /></a>;
        }
        if (type === 'next') {
          return <a><ChevronRight className='pagination-arrows' /></a>;
        }
        return originalElement;
    };


    const fetchTokenList = async () => {
        setIsTokenListLoading(true)
        try {
            const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/v1/liquidity-locker/all?page=${currentPage}&limit=${pagesize}&search=${searchKey}`
            const response = await axios.get(endpoint)
            if (response && response.status === 200) {
                const paginationDetails = response.data.payload.meta
                setTotalRecords(paginationDetails.itemCount)
                const tokenListResponse = response.data.payload.items
                setTokenList(tokenListResponse)
            } else {
                setTokenList([])
            }
            setIsTokenListLoading(false)
        } catch (error) {
            console.error("ERROR while fetching locked token list from the API ", error)
            setIsTokenListLoading(false)
            setTokenList([])
        }
    }

    useEffect(() => {
        fetchTokenList()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchKey])

    const onChange = (page) => {
        setCurrentPage(page)
    };

    const onShowSizeChange = (current, pageSize) => {
        setPageSize(pageSize)
    }

    return (
        <div className='table'>
            <div className='table-responsive'>
                <Table
                    loading={isTokenListLoading}
                    dataSource={tokenList}
                    pagination={false}
                >
                    <Column
                        title={t('Liquidity token')}
                        render={
                            (_, record) => (
                                <div className='d-md-flex'>
                                    <div>
                                        <img src={bsc} alt="token" style={{ width: '20px' }} />
                                        <img src={coin} alt="coin" style={{ width: '22px', marginRight: '10px', marginLeft: '-10px' }} />
                                    </div>

                                    <div>
                                        <span>
                                            {
                                                record.lockRecords && record.lockRecords.length > 0 ?
                                                    (record.lockRecords[0].title != null ? record.lockRecords[0].title : record.tokenName) : record.tokenName
                                            }
                                        </span><br />
                                        <span className='small text-muted'>
                                            {record.tokenName} - {record.tokenSymbol}
                                        </span>
                                    </div>
                                </div>
                            )
                        }
                    />
                    <Column title={t('Amount')} dataIndex="totalTokensLocked" key="id" />
                    <Column
                        key="id"
                        render={
                            (_, record, index) => (
                                <Link key={record.id} to={`/liquidity-list/view/${record.tokenAddress}`}>View</Link>
                            )
                        }
                    />
                </Table>

                <div className='d-flex justify-content-center mt-4'>
                    <Pagination
                        current={currentPage}
                        pageSize={pagesize}
                        defaultCurrent={1}
                        pageSizeOptions={["15", "30", "60", "90"]}
                        onChange={onChange}
                        showSizeChanger
                        onShowSizeChange={onShowSizeChange}
                        total={totalRecords} 
                        itemRender={itemRender}
                        />
                </div>
            </div>
        </div>
    )
}

export default AllTokenLockList