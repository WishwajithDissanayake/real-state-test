import React, { useEffect, useState } from 'react'
import { Table, Pagination } from 'antd'
import bsc from '../../../images/bsc.png'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'react-feather'

function AllTokenLockList(props) {
    const { searchKey } = props
    const { Column } = Table
    // pagination related data
    const [currentPage, setCurrentPage] = useState(1)
    const [totalRecords, setTotalRecords] = useState(1)
    const [pagesize, setPageSize] = useState(10)
    const [tokenList, setTokenList] = useState([])
    const [isTokenListLoading, setIsTokenListLoading] = useState(false)
    const { t } = useTranslation();


    const fetchTokenList = async () => {
        setIsTokenListLoading(true)
        try {
            const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/v1/token-locker/all?page=${currentPage}&limit=${pagesize}&search=${searchKey}`
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

    const itemRender = (_, type, originalElement) => {
        if (type === 'prev') {
          return <a><ChevronLeft className='pagination-arrows' /></a>;
        }
        if (type === 'next') {
          return <a><ChevronRight className='pagination-arrows' /></a>;
        }
        return originalElement;
    };

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
                        title={t("Token")}
                        key="id"
                        render={
                            (_, record, index) => (
                                <div className='d-md-flex' key={record.id}>
                                    <div>
                                        <img src={bsc} alt="token" style={{ width: '20px', marginRight: '10px' }} />
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
                    <Column title={t("Amount")} dataIndex="totalTokensLocked" key="id" />
                    <Column
                        key="id"
                        render={
                            (_, record, index) => (
                                <Link key={record.id} to={`/token-list/view/${record.tokenAddress}`}>View</Link>
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