import { Card, Tag, Spin, Image, notification, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import './PresaleWidget.css'
import { Row, Col } from 'reactstrap'
import PresaleCardLogo from '../../images/kingsfund.png'
import ProgressBarComponent from '../ProgressBarComponent/ProgressBarComponent'
import CountdownMini from '../Countdown/CountdownMini'
import usePoolStatus from '../../Hooks/usePoolStatus'
import { utils } from 'ethers'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { useWeb3React } from '@web3-react/core'
import Icon, { HeartFilled, CheckCircleFilled } from '@ant-design/icons'
import { getTruncatedTxt } from '../../helpers/Formatters'
import { useDispatch, useSelector } from 'react-redux'
import { initializeLikedPresales, changeOnLikedPresales } from '../../Redux/LikedPresales'

function PresaleWidget(props) {

    const { data: poolData } = props
    const [isBellClicked, setIsBellClicked] = useState(false)
    const [isFavoritePresale, setIsFavoritePresale] = useState(false)
    const { likedPresales, likedPresalesLength } = useSelector((state) => state.likedPresales)
    const { theme } = useSelector((state) => state.themeState)

    const { account } = useWeb3React()
    const { t } = useTranslation()
    const key = 'updatable';

    const dispatch = useDispatch()

    const HeartOutlinedSvg = () => (
        <svg width="1em" height="1em" fill="currentColor" stroke={theme === 'dark' ? 'white' : 'black'} strokeWidth="40" viewBox="0 0 1024 1024">
            <path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
        </svg>
    );

    const HeartOutlinedIcon = (props) => <Icon component={HeartOutlinedSvg} {...props} />;

    const {
        isLoading: isPoolStatusLoading,
        poolStatus
    } = usePoolStatus({ poolAddress: poolData.poolContractAddress, offChainPoolDetails: poolData })

    const getPrivateSaleImage = () => {
        if (poolData && poolData.logoURL) {
            return poolData.logoURL
        } else {
            return PresaleCardLogo
        }
    }

    const checkGivenPoolFavoriteByUser = () => {
        if (account) {
            //check the items already in array
            if (likedPresalesLength > 0) {
                if (likedPresales) {
                    const isPresaleInArray = likedPresales.find(item => item.poolContractAddress === poolData.poolContractAddress)
                    if (isPresaleInArray) {
                        setIsFavoritePresale(true)
                    } else {
                        setIsFavoritePresale(false)
                    }
                } else {
                    setIsFavoritePresale(false)
                }
            } else {
                setIsFavoritePresale(false)
            }
        }
    }

    useEffect(() => {
        checkGivenPoolFavoriteByUser()
        dispatch(initializeLikedPresales(account))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, likedPresalesLength, isFavoritePresale])

    const addToFavorite = () => {

        if (account) {
            //check the items already in array
            const localData = localStorage.getItem(account)
            if (localData) {
                const localDataObject = JSON.parse(localData)
                const favoritePresalesResponse = localDataObject?.favoritePresales
                if (favoritePresalesResponse) {
                    const isPresaleInArray = favoritePresalesResponse.find(item => item.poolContractAddress === poolData.poolContractAddress)
                    if (isPresaleInArray) {
                        const newArray = favoritePresalesResponse.filter(item => item.poolContractAddress !== isPresaleInArray.poolContractAddress)
                        const payload = {
                            favoritePresales: newArray
                        }
                        localStorage.setItem(account, JSON.stringify(payload))
                        // setIsFavoritePresale(false)
                        dispatch(changeOnLikedPresales(JSON.parse(localStorage.getItem(account)).favoritePresales))
                    } else {
                        // setIsFavoritePresale(true)
                        favoritePresalesResponse.push(poolData)
                        const payload = {
                            favoritePresales: favoritePresalesResponse
                        }
                        localStorage.setItem(account, JSON.stringify(payload))
                        dispatch(changeOnLikedPresales(JSON.parse(localStorage.getItem(account)).favoritePresales))
                    }
                }
            } else {
                const payload = {
                    favoritePresales: [poolData]
                }
                localStorage.setItem(account, JSON.stringify(payload))
                dispatch(changeOnLikedPresales(JSON.parse(localStorage.getItem(account)).favoritePresales))
            }

        } else {
            notification['error']({
                key,
                message: 'Authentication Error',
                description:
                    'Please connect your wallet',
            })
        }
        if (isBellClicked) {
            setIsBellClicked(false)
        } else {
            setIsBellClicked(true)
        }
    }

    return (
        <div>
            <Card className='kingsale-card-bg mt-5'>
                <Link to={`/presale-details/${poolData?.poolContractAddress}`}>
                    <div className="d-flex justify-content-center">
                        <Image
                            fallback={PresaleCardLogo}
                            preview={false}
                            src={getPrivateSaleImage()}
                            alt={poolData ? poolData.presaleName : ''}
                            className="card-logo" />
                    </div>

                    {/* <div className="d-flex justify-content-end hide-on-small-devices">
                        {
                            isPoolStatusLoading ? (
                                <div className='loader'>
                                    <Spin size="small" />
                                </div>
                            ) : (
                                <Tag color={poolStatus?.statusColor} style={{marginRight: '-3px'}}>
                                    {poolStatus?.statusName}
                                </Tag>
                            )
                        }
                    </div> */}

                    <div className="pool-status-tag-mobile">
                        <Row>
                            <Col xxl="8" xl="8" lg="8" md="7" sm="7" xs="7"></Col>
                            <Col xxl="4" xl="4" lg="4" md="5" sm="5" xs="5" className='text-center' style={{ marginTop: '-4px' }}>
                                {
                                    isPoolStatusLoading ? (
                                        <div className='loader'>
                                            <Spin size="small" />
                                        </div>
                                    ) : (
                                        <Tag color={poolStatus?.statusColor} style={{ padding: '5' }}>
                                            <span className='fw-bold'>{poolStatus?.statusName}</span>
                                        </Tag>
                                    )
                                }
                            </Col>
                        </Row>
                    </div>

                    <h4 className="mt-3 fw-bold">{poolData.presaleName ? getTruncatedTxt(poolData.presaleName, 25) : "~"}</h4>
                    <span>{t('Max Contribution:')} {poolData.maximumBuy ? utils.formatEther(poolData.maximumBuy) : 0} {poolData?.liquidityTokenName} </span>

                    <div className='d-flex mb-3'>
                        <div style={{ marginTop: '-2px' }}>
                            {
                                poolData?.isVerifiedPool ?
                                    <Tooltip title="Verified Presale Page"><CheckCircleFilled style={{ fontSize: '20px', marginRight: '5px', color: '#1da1f3' }} /></Tooltip>
                                    :
                                    <div className='mb-4'></div>
                            }
                        </div>

                        {
                            poolData?.kycLink !== "" &&
                            <a href={poolData?.kycLink} target="_blank" rel="noreferrer">
                                <Tag color="#fa541c">
                                    {t('KYC')}
                                </Tag>
                            </a>
                        }

                        {
                            poolData?.auditedLink !== "" &&
                            <a href={poolData?.auditedLink} target="_blank" rel="noreferrer">
                                <Tag color="#13c2c2">
                                    {t('Audit')}
                                </Tag>
                            </a>
                        }

                        {
                            poolData?.safuLink !== "" &&
                            <a href={poolData?.safuLink} target="_blank" rel="noreferrer">
                                <Tag color="#eb2f96">
                                    {t('SAFU')}
                                </Tag>
                            </a>
                        }
                    </div>

                    <ProgressBarComponent
                        poolAddress={poolData.poolContractAddress}
                        poolDetails={poolData}
                    />

                    <Row className="mt-3">
                        <Col>
                            <h6>{t('Hard Cap:')}</h6>
                        </Col>

                        <Col className="text-end">
                            <h6 className="primary-text" style={{ paddingLeft: '5px' }}>
                                {poolData.hardCap ? utils.formatEther(poolData.hardCap) : 0} {poolData?.liquidityTokenName}
                            </h6>
                        </Col>
                    </Row>
                </Link>
                <hr />

                <div className='d-flex justify-content-between'>
                    <div className='col-10'>
                        <Link to={`/presale-details/${poolData?.poolContractAddress}`} className={theme === 'dark' ? 'text-light' : 'text-dark'}>
                            <CountdownMini
                                startTime={poolData ? poolData.startTimeTimestamp : null}
                                endTime={poolData ? poolData.endTimeTimestamp : null}
                            />
                        </Link>
                    </div>

                    <div>
                        {
                            isFavoritePresale ? (
                                <HeartFilled
                                    onClick={() => addToFavorite()}
                                    className="mt-1"
                                    style={{ cursor: 'pointer', fontSize: '35px', color: '#F42C38' }} />
                            ) : (
                                // <HeartOutlined
                                //     onClick={() => addToFavorite()}
                                //     className="mt-1"
                                //     style={{ cursor: 'pointer', fontSize: '35px' }} />
                                <HeartOutlinedIcon
                                    onClick={() => addToFavorite()}
                                    className="mt-1"
                                    style={{ cursor: 'pointer', fontSize: '35px', color: 'transparent' }} />
                            )
                        }

                        {/* <Bell size={20} className={`mt-3 ${isBellClicked ? 'bell-clicked' : ''}`}  onClick={() => addToFavorite()} /> */}
                    </div>
                </div>

            </Card>
        </div>
    )
}

export default PresaleWidget