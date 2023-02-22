import React, { useState, useEffect } from 'react'
import { Col, Row } from 'reactstrap'
import { Pagination, Input, Form, Select, Spin } from 'antd'
import StakingWidget from '../../components/StakingComponents/StakingWidget'
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'react-feather'

function Pools() {

    const { t } = useTranslation();
    const { Option } = Select;

    const PAGE_LIMIT = 9
    const [poolDataList, setPoolDataList] = useState([])
    const [totalPools, setTotalPools] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchInput, setSearchInput] = useState()
    const [isStakingPoolDataListLoading, setIsStakingPoolDataListLoading] = useState(false)
    const [filterValue, setFIlterValue] = useState('')

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const onChange = (pageNumber) => {
        if (pageNumber !== currentPage) {
            setCurrentPage(pageNumber)
        }
    }

    const poolStatusList = [
        { name: t("All Status"), value: '' },
        { name: t("Live"), value: 'live' },
        { name: t("Finished"), value: 'finished' }
    ];

    const poolSortList = [
        { name: t('No Filter'), value: '' },
        { name: t('Hot'), value: 'hot' },
        { name: t('APR'), value: 'apr' },
        { name: t('Earned'), value: 'earned' },
        { name: t('Total Staked'), value: 'total-staked' },
        { name: t('Latest'), value: 'latest' }
    ]

    const handleStakingPoolSearchChange = (value) => {
        setFIlterValue(value)
        fetchAllStakingPools(value)
    }

    const handlePresaleSortChange = (value) => {
        console.log(value)
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

    const fetchAllStakingPools = async (selectedFilleterValue) => {
        setIsStakingPoolDataListLoading(true)
        try {
            const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/v1/staking/all?page=${currentPage}&limit=${PAGE_LIMIT}&status=${selectedFilleterValue}&search=${searchInput ? searchInput : ''}`
            const response = await axios.get(endpoint)
            if (response.status === 200) {
                const payload = response.data.payload
                if (payload) {
                    const total = payload.meta.totalItems
                    setTotalPools(total)
                    setPoolDataList(payload.items)
                } else {
                    setPoolDataList([])
                }
                setIsStakingPoolDataListLoading(false)
            }
        } catch (error) {
            setIsStakingPoolDataListLoading(false)
            console.log("ERROR while fetching active pools from API ", error)
        }
    }

    useEffect(() => {
        fetchAllStakingPools(filterValue)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterValue, searchInput, currentPage])

    return (
        <div className='mt-5 presale-padding col-lg-11 mx-auto'>

            <Row>
                <Col xxl="8" xl="8" lg="8" md="8" sm="12" xs="12">
                    <span className='small'>{t('Search Pools')}</span>
                    <Input
                        lang='en'
                        value={searchInput}
                        name="tokenAddress"
                        onChange={e => setSearchInput(e.target.value)}
                        className='rounded-input'
                        placeholder={t('Search Pools')} />
                </Col>
                <Col xxl="2" xl="2" lg="2" md="2" sm="6" xs="6">
                    <span className='small'>{t('Filter By')}</span>
                    <Form.Item
                        name="filertby"
                    >
                        <Select
                            onChange={handleStakingPoolSearchChange}
                            defaultValue={t("All Status")}
                        >
                            {
                                poolStatusList.map(item => (
                                    <Option
                                        value={item.value}
                                        key={item.value}>
                                        {item.name}
                                    </Option>
                                ))
                            }

                        </Select>
                    </Form.Item>
                </Col>

                <Col xxl="2" xl="2" lg="2" md="2" sm="6" xs="6">
                    <span className='small'>{t('Sort By')}</span>
                    <Form.Item
                        name="sortby"
                    >
                        <Select
                            onChange={handlePresaleSortChange}
                            defaultValue={t("No Filter")}
                        >
                            {
                                poolSortList.map(item => (
                                    <Option
                                        value={item.value}
                                        key={item.value}>
                                        {item.name}
                                    </Option>
                                ))
                            }

                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <div>
                    {
                        isStakingPoolDataListLoading ? (
                            <Col lg="12" md="12" sm="12">
                                <div className='d-flex justify-content-center'>
                                    <Spin size='medium' />
                                </div>
                            </Col>
                        ) : (
                            <>
                                {
                                    totalPools > 0 ? (
                                        <Row>
                                            {
                                                poolDataList.map((item, index) => (

                                                    <Col xxl="4" xl="6" lg="6" md="6" sm="12" xs="12" key={index}>
                                                        <div className='mt-5'>
                                                            <StakingWidget
                                                                poolData={item}
                                                                key={index} />
                                                        </div>
                                                    </Col>
                                                ))
                                            }
                                        </Row>
                                    ) : (
                                        <div className='d-flex justify-content-center'>
                                            <span>{t('No pools found')}</span>
                                        </div>
                                    )
                                }
                            </>

                        )
                    }
                </div>
            </Row>

            <Row>
                <Col lg="12" md="12" sm="12">
                    <div className="d-flex justify-content-center my-5">
                        <Pagination
                            total={totalPools}
                            defaultPageSize={PAGE_LIMIT}
                            current={currentPage}
                            onChange={onChange}
                            itemRender={itemRender}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default Pools