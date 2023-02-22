import React, { useEffect, useState } from 'react';
import { Button, Spin } from 'antd';
import { TrendingUp } from 'react-feather'
import { useTranslation } from 'react-i18next'
import axios from 'axios';
import { Link } from 'react-router-dom';

function TrendingList(props) {

    const { width } = props

    const [isCollapse, setIsCollapse] = useState(false)
    const [trendingList, setTrendingList] = useState([])
    const [trendingListLoading, setTrendingListLoading] = useState(false)

    useEffect(() => {
        if (width === 'width-280') {
            setIsCollapse(false)
        } else {
            setIsCollapse(true)
        }
    }, [width])

    useEffect(() => {
        const fetchTrendingList = async () => {
            setTrendingListLoading(true)
            try {
                const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/v1/trending-presales/all`
                const response = await axios.get(endpoint)
                if (response.status === 200) {
                    const payload = response.data.payload
                    if (payload) {
                        setTrendingList(payload)
                    } else {
                        setTrendingList([])
                    }
                }
            } catch (error) {
                console.log("ERROR while fetching active pools from API ", error)
            }
            setTrendingListLoading(false)
        }

        fetchTrendingList()

    }, [])

    const { t } = useTranslation();

    return (
        <div className='affix-section mt-lg-2 col-12'>
            <div className='affix-container' style={{ padding: '1.5px' }}>

                <Button type="text" className='trending-up-button'>
                    <TrendingUp size={16} style={{ marginRight: '4px', color: '#e6bd4f', marginLeft: '-3px' }} />
                    <span className='trending-name'>{t('Trending')}</span>
                </Button>

                <div className='ticker-section'>
                    <div>
                        {
                            trendingListLoading ?
                                <Spin size='small' className='p-2' />
                                :

                                <div className="wrapper">
                                    <div className="marquee">
                                        <>
                                            {
                                                trendingList.map((data, index) => (
                                                    <span className='marquee-ticker' key={index}>
                                                        <Link to={`/presale-details/${data.presaleContractAddress}`}><span className='trending-number'>#{index + 1} </span><span className='primary-text'>{data.tokenSymbol}</span></Link>
                                                    </span>
                                                ))
                                            }

                                            <span style={{ marginLeft: '30px' }}>
                                                {
                                                    trendingList.map((data, index) => (
                                                        <span className='marquee-ticker' key={index}>
                                                            <Link to={`/presale-details/${data.presaleContractAddress}`}><span className='trending-number'>#{index + 1} </span><span className='primary-text'>{data.tokenSymbol}</span></Link>
                                                        </span>
                                                    ))
                                                }
                                            </span>

                                            <span style={{ marginLeft: '30px' }}>
                                                {
                                                    trendingList.map((data, index) => (
                                                        <span className='marquee-ticker' key={index}>
                                                            <Link to={`/presale-details/${data.presaleContractAddress}`}><span className='trending-number'>#{index + 1} </span><span className='primary-text'>{data.tokenSymbol}</span></Link>
                                                        </span>
                                                    ))
                                                }
                                            </span>

                                            <span style={{ marginLeft: '30px' }}>
                                                {
                                                    trendingList.map((data, index) => (
                                                        <span className='marquee-ticker' key={index}>
                                                            <Link to={`/presale-details/${data.presaleContractAddress}`}><span className='trending-number'>#{index + 1} </span><span className='primary-text'>{data.tokenSymbol}</span></Link>
                                                        </span>
                                                    ))
                                                }
                                            </span>
                                        </>
                                    </div>
                                </div>

                        }
                    </div>
                </div>
            </div>
        </div>
    )

}

export default TrendingList