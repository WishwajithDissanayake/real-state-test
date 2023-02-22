import React, { useState, useEffect } from 'react'
import { Col, Row } from 'reactstrap'
import PresaleWidget from '../../components/PresalesComponents/PresaleWidget'
import { Pagination, Spin, Form, Input, Select } from 'antd'
import axios from 'axios'
import './Presales.css'
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
import { changeSearchValue, changeFilterValue, changeSortValue } from '../../Redux/PresaleListFilters'

function LivePresales() {

    const { t } = useTranslation();
    const PAGE_LIMIT = 9
    const [isPoolDataLoading, setIsPoolDataLoading] = useState(false)
    const [poolDataList, setPoolDataList] = useState([])
    const [totalPools, setTotalPools] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    // const [searchInput, setSearchInput] = useState('')
    // const [filterValue, setFIlterValue] = useState('')
    // const [sortByValue, setSortByValue] = useState('')
    const dispatch = useDispatch()
    const { searchValue, filterValue, sortValue } = useSelector((state) => state.presaleListFilters)

    const { Option } = Select;

    const presaleStatusList = [
        { name: t("All Status"), value: '' },
        { name: t("Live"), value: 'live' },
        { name: t("Upcoming"), value: 'upcoming' },
        { name: t("Filled"), value: 'filled' },
        { name: t("Finalized"), value: 'finalized' },
        { name: t("Ended"), value: 'ended' },
        { name: t("Canceled"), value: 'canceled' },
    ];

    const presaleSortList = [
        { name: t('No Filter'), value: '' },
        { name: t('Hard Cap'), value: 'hard_cap' },
        { name: t('Soft Cap'), value: 'soft_cap' },
        { name: t('LP Percent'), value: 'liquidity_percentage' },
        { name: t('Start Time'), value: 'start_time_timestamp' },
        { name: t('End Time'), value: 'end_time_timestamp' }
    ]

    const itemRender = (_, type, originalElement) => {
        if (type === 'prev') {
            return <a><ChevronLeft className='pagination-arrows' /></a>;
        }
        if (type === 'next') {
            return <a><ChevronRight className='pagination-arrows' /></a>;
        }
        return originalElement;
    };


    const handlePresaleFilterChange = (value) => {
        dispatch(changeFilterValue(value))
    }

    const handlePresaleSortChange = (value) => {
        dispatch(changeSortValue(value))
    }

    const fetchActivePools = async () => {
        setIsPoolDataLoading(true)
        try {
            const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/v1/presale/all?page=${currentPage}&limit=${PAGE_LIMIT}&status=${filterValue}&search=${searchValue}&sortBy=${sortValue}`
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
                setIsPoolDataLoading(false)
            }
        } catch (error) {
            setIsPoolDataLoading(false)
            console.log("ERROR while fetching active pools from API ", error)
        }
    }

    const onChange = (pageNumber) => {
        if (pageNumber !== currentPage) {
            setCurrentPage(pageNumber)
        }
    }

    useEffect(() => {
        fetchActivePools()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortValue, filterValue, currentPage])

    useEffect(() => {
        const getData = setTimeout(() => {
            fetchActivePools()
        }, 500)

        return () => clearTimeout(getData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue])

    return (
        <div className='presale-padding'>
            <Row>
                <Col xxl="8" xl="8" lg="8" md="8" sm="12" xs="12">
                    <span className='small'>{t('Enter token name, symbol or token address')}</span>
                    <Input
                        lang='en'
                        value={searchValue}
                        name="tokenAddress"
                        onChange={e => dispatch(changeSearchValue(e.target.value.toLowerCase()))}
                        className='rounded-input'
                        placeholder={t('Enter token name, symbol or token address')} />

                </Col>

                <Col xxl="2" xl="2" lg="2" md="2" sm="6" xs="6">
                    <span className='small'>{t('Filter By')}</span>
                    <Form.Item
                        name="filertby"
                    >
                        <Select
                            onChange={handlePresaleFilterChange}
                            defaultValue={filterValue}
                        >
                            {
                                presaleStatusList.map(item => (
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
                            defaultValue={sortValue}
                        >
                            {
                                presaleSortList.map(item => (
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
                <div className='mt-lg-3'>
                    {
                        isPoolDataLoading ? (
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

                                                    <Col xxl="4" xl="4" lg="6" md="6" sm="12" key={index}>
                                                        <div className='mt-3 h-100'>
                                                            <PresaleWidget
                                                                data={item}
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

export default LivePresales