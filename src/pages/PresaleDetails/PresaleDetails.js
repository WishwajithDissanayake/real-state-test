import React, { useState, useEffect } from 'react'
import { ArrowLeftCircle } from 'react-feather'
import { useNavigate, useParams } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import './PresaleDetails.css'
import PoolTokenDetails from './PoolTokenDetails'
import TokenMetrics from './TokenMetrics'
import ContributionWidget from './ContributionWidget'
import StatWidget from './StatWidget'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import { getTheOwnerOfThePool } from '../../Blockchain/services/presale.service'
import AdminControlWidget from './AdminControlWidget'
import { Card } from 'antd'
import { DiscussionEmbed } from 'disqus-react';

function PresaleDetails() {

    const navigate = useNavigate()
    const { poolAddress } = useParams()

    const [presaleDetails, setPresaleDetails] = useState(null)
    const [isPresaleLoading, setIsPresaleLoading] = useState(false)
    const [isPoolAdmin, setIsPoolAdmin] = useState(false)
    const [ownerAddress, setOwnerAddress] = useState(false)
    const [shouldForcedRefresh, setShouldForcedRefresh] = useState(false)
    const [refreshWhitelist, setRefreshWhitelist] = useState(false)
    const { account } = useWeb3React()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if (poolAddress) {
            fetchPrivateSalePoolDetails()
            fetchThePoolOwner()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [poolAddress])

    useEffect(() => {
        if (ownerAddress && account) {
            if (ownerAddress.toLowerCase() === account.toLowerCase()) {
                setIsPoolAdmin(true)
            } else {
                setIsPoolAdmin(false)
            }
        } else {
            setIsPoolAdmin(false)
        }
    }, [ownerAddress, account])

    const fetchPrivateSalePoolDetails = async () => {
        try {
            setIsPresaleLoading(true)
            const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/v1/presale/get/${poolAddress}`
            const response = await axios.get(endpoint)
            if (response.status === 200) {
                setPresaleDetails(response.data.payload || null)
            } else {
                setPresaleDetails(null)
            }
            setIsPresaleLoading(false)
        } catch (error) {
            console.error("ERROR while fetching api data for pool ", error)
            setIsPresaleLoading(false)
            setPresaleDetails(null)
        }
    }

    const fetchThePoolOwner = async () => {
        try {
            const response = await getTheOwnerOfThePool(poolAddress)
            if (response) {
                setOwnerAddress(response)
            } else {
                setOwnerAddress(null)
            }
        } catch (error) {
            setOwnerAddress(null)
            console.error("ERROR while fetching the pool owner ", error)
        }
    }

    const handleBack = () => {
        navigate(-1)
    }

    return (
        <div className="mb-5">
            <Row>
                <Col className="text-start">
                    <div className="d-flex hide-on-mobile">
                        <ArrowLeftCircle className="back-button" onClick={handleBack} />
                    </div>

                    <div className='hide-on-pc'>
                        <ArrowLeftCircle size={18} className="back-button primary-text" onClick={handleBack} />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xxl="8" xl="8" lg="8" md="12" sm="12" xs="12">
                    <PoolTokenDetails
                        presaleSaleDetails={presaleDetails}
                        presaleAddress={poolAddress}
                        isPresaleLoading={isPresaleLoading}
                        refreshWhitelist={refreshWhitelist}
                        setRefreshWhitelist={setRefreshWhitelist}
                    />

                    <div className='hide-on-pc'>
                        <ContributionWidget
                            presaleAddress={poolAddress}
                            presaleSaleDetails={presaleDetails}
                            shouldForcedRefresh={shouldForcedRefresh}
                            setShouldForcedRefresh={setShouldForcedRefresh}
                        />
                    </div>

                    <div className='hide-on-pc'>
                        <StatWidget
                            presaleSaleDetails={presaleDetails}
                            presaleAddress={poolAddress}
                            isPresaleLoading={isPresaleLoading}
                        />
                    </div>

                    <TokenMetrics presaleDetails={presaleDetails} />

                    <Card className='kingsale-card-bg mt-2'>
                        <DiscussionEmbed
                            shortname='kingsale-finance'
                            config={
                                {
                                    // url: 'https://kingsale-finance.disqus.com/embed.js',
                                    url: `https://kingsale-finance.disqus.com/${poolAddress}`,
                                    identifier: poolAddress,
                                    title: poolAddress,
                                    language: 'zh_EN'
                                }
                            }
                        />
                    </Card>
                </Col>

                <Col xxl="4" xl="4" lg="4" md="12" sm="12" xs="12">
                    <div className='hide-on-mobile'>
                        <ContributionWidget
                            presaleAddress={poolAddress}
                            presaleSaleDetails={presaleDetails}
                            shouldForcedRefresh={shouldForcedRefresh}
                            setShouldForcedRefresh={setShouldForcedRefresh}
                        />
                    </div>

                    <div className='hide-on-mobile'>
                        <StatWidget
                            presaleSaleDetails={presaleDetails}
                            presaleAddress={poolAddress}
                            isPresaleLoading={isPresaleLoading}
                        />
                    </div>

                    {
                        isPoolAdmin ? (
                            <AdminControlWidget
                                shouldForcedRefresh={shouldForcedRefresh}
                                setRefreshWhitelist={setRefreshWhitelist}
                                presaleSaleDetails={presaleDetails}
                                presaleAddress={poolAddress}
                            />
                        ) : (<></>)
                    }
                </Col>
            </Row>
        </div>
    )
}

export default PresaleDetails