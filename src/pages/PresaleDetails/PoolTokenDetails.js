/* eslint-disable jsx-a11y/iframe-has-title */
import { Card, Tag, Spin, Image, Tooltip } from 'antd'
import React, { useState, useEffect } from 'react'
import CoverImg from '../../images/CoverImg.jpeg'
import ProfilePic from '../../images/kingsfund.png'
import { Row, Col } from 'reactstrap'
import Social from './Social'
import { DateTime } from 'luxon'
import { utils } from 'ethers'
import usePoolStatus from '../../Hooks/usePoolStatus'
import ReactHtmlParser from 'react-html-parser'
import NumberFormat from 'react-number-format'
import { getLiquidityProviderDetailsByRouterAddress } from '../../Blockchain/services/presale.service'
import { useTranslation } from 'react-i18next';
import { CheckCircleFilled } from '@ant-design/icons'
import WhitelistedTable from './WhitelistedTable'

function PoolTokenDetails(props) {

    const { t } = useTranslation();
    const { presaleSaleDetails, presaleAddress, isPresaleLoading, refreshWhitelist, setRefreshWhitelist } = props
    const [formattedStartDate, setFormattedStartDate] = useState(DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss"))
    const [formattedEndDate, setFormattedEndDate] = useState(DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss"))
    const [liquidityUnlockTime, setLiquidityUnlockTime] = useState(0)
    const [isReadMore, setIsReadMore] = useState(true)

    const {
        isLoading: isPoolStatusLoading,
        poolStatus
    } = usePoolStatus({ poolAddress: presaleAddress })

    const calculateTokensForPool = () => {

        if (presaleSaleDetails) {
            const tokenDecimals = parseInt(presaleSaleDetails?.tokenDecimals)
            const totalTokenAmount = presaleSaleDetails?.totalTokenAmount
            const actualTotalTokenAmount = utils.formatUnits(totalTokenAmount?.toString(), tokenDecimals)
            return actualTotalTokenAmount
        } else {
            return 0
        }
    }

    const getPresaleImage = () => {
        if (presaleSaleDetails && presaleSaleDetails?.logoURL) {
            return presaleSaleDetails?.logoURL
        } else {
            return ProfilePic
        }
    }

    const getCoverImage = () => {
        if (presaleSaleDetails && presaleSaleDetails?.coverImageUrl) {
            return presaleSaleDetails?.coverImageUrl
        } else {
            return CoverImg
        }
    }

    const getYoutubrUrl = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        const videoId = (match && match[2].length === 11)
            ? match[2]
            : null;

        const iframeMarkup = <iframe className="responsive-iframe" src={`//www.youtube.com/embed/${videoId}`}
            frameborder="0" allowfullscreen></iframe>;

        return iframeMarkup
    }


    useEffect(() => {
        if (presaleSaleDetails && presaleSaleDetails?.startTimeTimestamp) {
            const startTimeFormatted = DateTime.fromSeconds(parseInt(presaleSaleDetails?.startTimeTimestamp), { zone: "utc" })
                .toFormat("yyyy-MM-dd HH:mm:ss")
            setFormattedStartDate(startTimeFormatted)
        }

        if (presaleSaleDetails && presaleSaleDetails?.endTimeTimestamp) {
            const endTimeFormatted = DateTime.fromSeconds(parseInt(presaleSaleDetails?.endTimeTimestamp), { zone: "utc" })
                .toFormat("yyyy-MM-dd HH:mm:ss")
            setFormattedEndDate(endTimeFormatted)
        }

        if (presaleSaleDetails && presaleSaleDetails?.liquidityUnlockTimestamp) {
            const SECONDS_PER_DAY = 86400
            const unlockInDays = parseInt(presaleSaleDetails?.liquidityUnlockTimestamp) / SECONDS_PER_DAY
            setLiquidityUnlockTime(unlockInDays)
        }
    }, [presaleSaleDetails])


    return (
        <Card className="mt-2 kingsale-card-bg">
            {
                isPresaleLoading ? (
                    <div className='d-flex mt-2 justify-content-center'>
                        <Spin size="small" />
                    </div>
                ) : (
                    <div className="cover-area" style={{ backgroundImage: `url(${getCoverImage()})` }}></div>
                )
            }

            <Row>
                <Col lg="12" md="12" sm="12">
                    {
                        isPresaleLoading ? (
                            <div className='d-flex mt-2 justify-content-center'>
                                <Spin size="small" />
                            </div>
                        ) : (
                            <>
                                <div className='d-flex'>
                                    <div className='hide-on-mobile'>
                                        <Image
                                            preview={false}
                                            // width={70}
                                            className="user-profile-pic"
                                            fallback={ProfilePic}
                                            src={getPresaleImage()} alt="" />
                                    </div>

                                    <div className='hide-on-pc mx-auto'>
                                        <Image
                                            preview={false}
                                            width={100}
                                            className="user-profile-pic-mobile"
                                            fallback={ProfilePic}
                                            src={getPresaleImage()} alt="" />
                                    </div>

                                    <div className='hide-on-mobile' style={{ marginLeft: '30px' }}>
                                        <span>
                                            {/* TODO : Trim the long text max title length 100 chars */}
                                            <span className='fw-bold' style={{ fontSize: '26px' }}>{presaleSaleDetails ? presaleSaleDetails?.presaleName : t('Pending')}</span> {
                                                isPoolStatusLoading ? (
                                                    <div className='loader'>
                                                        <Spin size="small" />
                                                    </div>
                                                ) : (
                                                    <div className='d-flex'>
                                                        <div style={{ marginTop: '-1px' }}>
                                                            {
                                                                presaleSaleDetails?.isVerifiedPool && <Tooltip title="Verified Presale Page"><CheckCircleFilled style={{ fontSize: '21px', marginRight: '5px', color: '#1da1f3' }} /></Tooltip>
                                                            }
                                                        </div>

                                                        {
                                                            presaleSaleDetails?.kycLink !== "" &&
                                                            <a href={presaleSaleDetails?.kycLink} target="_blank" rel="noreferrer">
                                                                <Tag color="#fa541c">
                                                                    {t('KYC')}
                                                                </Tag>
                                                            </a>
                                                        }

                                                        {
                                                            presaleSaleDetails?.auditedLink !== "" &&
                                                            <a href={presaleSaleDetails?.auditedLink} target="_blank" rel="noreferrer">
                                                                <Tag color="#13c2c2">
                                                                    {t('Audit')}
                                                                </Tag>
                                                            </a>
                                                        }

                                                        {
                                                            presaleSaleDetails?.safuLink !== "" &&
                                                            <a href={presaleSaleDetails?.safuLink} target="_blank" rel="noreferrer">
                                                                <Tag color="#eb2f96">
                                                                    {t('SAFU')}
                                                                </Tag>
                                                            </a>
                                                        }

                                                        <div>
                                                            <Tag color={poolStatus?.statusColor} className="fw-bold" style={{ paddingBottom: '1px' }}>
                                                                {poolStatus?.statusName}
                                                            </Tag>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </span>

                                        <div className="mt-2">
                                            <Social presaleDetails={presaleSaleDetails}
                                                isPresaleLoading={isPresaleLoading} />
                                        </div>
                                    </div>
                                </div>

                                <div className="hide-on-tabs-and-pc">
                                    <Row>
                                        <Col xxl="6" xl="6" lg="6" md="7" sm="7" xs="7"></Col>
                                        <Col xxl="6" xl="6" lg="6" md="5" sm="5" xs="5" className='text-center pool-status-tag-mobile pool-detailed-tag' style={{ marginLeft: '8px' }}>
                                            {
                                                isPoolStatusLoading ?
                                                    <div>
                                                        <Spin size="small" />
                                                    </div>
                                                    :
                                                    <Tag className='fw-bold' color={poolStatus?.statusColor}>
                                                        {poolStatus?.statusName}
                                                    </Tag>
                                            }
                                        </Col>
                                    </Row>
                                </div>

                                <div className='hide-on-pc mt-2'>
                                    <span>
                                        {/* TODO : Trim the long text max title length 100 chars */}
                                        <h5 className='fw-bold'>{presaleSaleDetails ? presaleSaleDetails?.presaleName : t('Pending')}</h5> {
                                            (
                                                <div className='d-flex'>
                                                    <div style={{ marginTop: '-1px' }}>
                                                        {
                                                            presaleSaleDetails?.isVerifiedPool && <Tooltip title="Verified Presale Page"><CheckCircleFilled style={{ fontSize: '21px', marginRight: '5px', color: '#1da1f3' }} /></Tooltip>
                                                        }
                                                    </div>

                                                    {
                                                        presaleSaleDetails?.kycLink !== "" &&
                                                        <a href={presaleSaleDetails?.kycLink} target="_blank" rel="noreferrer">
                                                            <Tag color="#fa541c">
                                                                {t('KYC')}
                                                            </Tag>
                                                        </a>
                                                    }

                                                    {
                                                        presaleSaleDetails?.auditedLink !== "" &&
                                                        <a href={presaleSaleDetails?.auditedLink} target="_blank" rel="noreferrer">
                                                            <Tag color="#13c2c2">
                                                                {t('Audit')}
                                                            </Tag>
                                                        </a>
                                                    }

                                                    {
                                                        presaleSaleDetails?.safuLink !== "" &&
                                                        <a href={presaleSaleDetails?.safuLink} target="_blank" rel="noreferrer">
                                                            <Tag color="#eb2f96">
                                                                {t('SAFU')}
                                                            </Tag>
                                                        </a>
                                                    }

                                                    {
                                                        isPoolStatusLoading ?
                                                            <Spin size="small" className='hide-on-small-devices' />
                                                            :
                                                            <Tag color={poolStatus?.statusColor} className='hide-on-small-devices fw-bold'>
                                                                {poolStatus?.statusName}
                                                            </Tag>
                                                    }
                                                </div>
                                            )
                                        }
                                    </span>

                                    <div className='mt-2'>
                                        <Social presaleDetails={presaleSaleDetails}
                                            isPresaleLoading={isPresaleLoading} />
                                    </div>
                                </div>

                                <div>
                                    <Row className="mt-4">
                                        <Col>
                                            <div className='hide-on-mobile'>
                                                {
                                                    presaleSaleDetails ?
                                                        <div style={{
                                                            overflowWrap: 'break-word'
                                                        }}>{ReactHtmlParser(presaleSaleDetails?.description)}</div>
                                                        :
                                                        <Tag color="#d3bc84">{t('Pending')}</Tag>
                                                }
                                            </div>

                                            <div className='hide-on-pc'>
                                                {
                                                    presaleSaleDetails ?
                                                        <>
                                                            <div className='token-description' style={{
                                                                height: isReadMore ? '4.5rem' : '100%',
                                                                lineHeight: '1.5rem',
                                                                overflow: 'hidden',
                                                            }}>
                                                                {ReactHtmlParser(presaleSaleDetails?.description)}
                                                            </div>
                                                            <span
                                                                style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'end',
                                                                    cursor: 'pointer',
                                                                    padding: '10px',
                                                                    color: '#e6bd4f'
                                                                }}
                                                                onClick={() => setIsReadMore(!isReadMore)}>
                                                                {isReadMore ? 'Show More' : 'Show Less'}
                                                            </span>
                                                        </>
                                                        :
                                                        ""
                                                }
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                                {
                                    presaleSaleDetails?.youTubeLink &&
                                    <div>
                                        <Row className="mt-4 mb-4">
                                            <Col>
                                                <div className='video-container'>
                                                    {presaleSaleDetails?.youTubeLink && getYoutubrUrl(presaleSaleDetails?.youTubeLink)}
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                }

                            </>
                        )
                    }

                </Col>
            </Row>

            <Row>
                <Col lg="12" md="12" sm="12">

                    <div className='mt-4'>

                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <span>{t('Presale Address')}</span>
                            </div>

                            <div className='text-end'>
                                <a
                                    className="small"
                                    href={`${process.env.REACT_APP_BLOCK_EXPLORER}/address/${presaleSaleDetails?.poolContractAddress}`}
                                    rel="noreferrer"
                                    target="_blank"
                                    style={{ wordBreak: 'break-all' }}>
                                    {presaleSaleDetails ? presaleSaleDetails?.poolContractAddress : <Tag color="#d3bc84">{t('Pending')}</Tag>}
                                </a>
                            </div>
                        </div>
                        <hr />

                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <span>{t('Token Name')}</span>
                            </div>

                            <div className='text-end'>
                                <span>
                                    {presaleSaleDetails ? presaleSaleDetails?.tokenName : <Tag color="#d3bc84">{t('Pending')}</Tag>}
                                </span>
                            </div>
                        </div>
                        <hr />

                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <span>{t('Token Address')}</span>
                            </div>

                            <div className='text-end'>
                                <div>
                                    <a
                                        className="small"
                                        href={`${process.env.REACT_APP_BLOCK_EXPLORER}/address/${presaleSaleDetails?.tokenAddress}`}
                                        rel="noreferrer"
                                        target="_blank"
                                        style={{ wordBreak: 'break-all' }}>
                                        {presaleSaleDetails ? presaleSaleDetails?.tokenAddress : <Tag color="#d3bc84">{t('Pending')}</Tag>}
                                    </a><br />
                                    <span className='small text-validation-error'>Do not send BNB directly to the Token Address!</span>
                                </div>
                            </div>
                        </div>
                        <hr />



                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <span>{t('Token Symbol')}</span>
                            </div>

                            <div className='text-end'>
                                <span>
                                    {presaleSaleDetails ? presaleSaleDetails?.tokenSymbol : <Tag color="#d3bc84">{t('Pending')}</Tag>}
                                </span>
                            </div>
                        </div>
                        <hr />

                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <span>{t('Token Decimals')}</span>
                            </div>

                            <div className='text-end'>
                                <span>
                                    {presaleSaleDetails ? presaleSaleDetails?.tokenDecimals : '-'}
                                </span>
                            </div>
                        </div>
                        <hr />

                        {/* <div className='d-md-flex justify-content-between'>
                            <div>
                                <span>Fund Pool Address</span>
                            </div>

                            <div>
                                <a className="small" href="#" rel="noreferrer" target="_blank" style={{ wordBreak: 'break-all' }}>
                                    0xad09c8A0CC1bA773FED5dabb36f32Abe3668BFE8
                                </a><br />
                                <span className="small">Do not send BNB directly to the Funding pool address!</span>
                            </div>
                        </div>
                        <hr /> */}

                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <span>{t('Tokens For Presale')}</span>
                            </div>

                            <div className='text-end'>
                                <span>
                                    {/* {calculateTokensForPool()} {presaleSaleDetails?.tokenSymbol} */}
                                    <NumberFormat
                                        decimalScale={3}
                                        value={calculateTokensForPool()}
                                        displayType={'text'}
                                        suffix={presaleSaleDetails ? ' ' + presaleSaleDetails?.tokenSymbol : ''}
                                        thousandSeparator={true}
                                    />
                                </span>
                            </div>
                        </div>
                        <hr />

                        {/* <div className='d-md-flex justify-content-between'>
                            <div>
                                <span>Tokens For Liquidity</span>
                            </div>

                            <div>
                                <span>4.275 $EFBP 02</span>
                            </div>
                        </div>
                        <hr /> */}

                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <span>{t('Presale Rate')}</span>
                            </div>

                            <div className='text-end'>
                                <span>
                                    1 {presaleSaleDetails ? presaleSaleDetails?.liquidityTokenName : ''} = {
                                        <NumberFormat
                                            decimalScale={3}
                                            value={presaleSaleDetails ? utils.formatUnits(presaleSaleDetails?.tokensPerBNB, presaleSaleDetails?.tokenDecimals) : 0}
                                            displayType={'text'}
                                            suffix={presaleSaleDetails ? ' ' + presaleSaleDetails?.tokenSymbol : ''}
                                            thousandSeparator={true}
                                        />
                                    }
                                </span>
                            </div>
                        </div>
                        <hr />

                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <span>{t('Listing Rate')}</span>
                            </div>

                            <div className='text-end'>
                                <span>
                                    1 {presaleSaleDetails ? presaleSaleDetails?.liquidityTokenName : ''} = {
                                        <NumberFormat
                                            decimalScale={3}
                                            value={presaleSaleDetails ? utils.formatUnits(presaleSaleDetails?.launchRate, presaleSaleDetails?.tokenDecimals) : 0}
                                            displayType={'text'}
                                            suffix={presaleSaleDetails ? ' ' + presaleSaleDetails?.tokenSymbol : ''}
                                            thousandSeparator={true}
                                        />
                                    }
                                </span>
                            </div>
                        </div>
                        <hr />

                        {/* <div className='d-md-flex justify-content-between'>
                            <div>
                                <span>Initial Market Cap (estimate)</span>
                            </div>

                            <div>
                                <span>$95,256,666,361,845</span>
                            </div>
                        </div>
                        <hr /> */}

                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <span>{t('Soft Cap')}</span>
                            </div>

                            <div className='text-end'>
                                <span>
                                    {presaleSaleDetails ? utils.formatEther(presaleSaleDetails?.softCap) : ''} {presaleSaleDetails ? presaleSaleDetails?.liquidityTokenName : ''}
                                </span>
                            </div>
                        </div>
                        <hr />

                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <span>{t('Hard Cap')}</span>
                            </div>

                            <div className='text-end'>
                                <span>
                                    {presaleSaleDetails ? utils.formatEther(presaleSaleDetails?.hardCap) : ''} {presaleSaleDetails ? presaleSaleDetails?.liquidityTokenName : ''}
                                </span>
                            </div>
                        </div>
                        <hr />

                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <span>{t('Presale Start Time')}</span>
                            </div>

                            <div className='text-end'>
                                <span>{formattedStartDate ? formattedStartDate : 'N/A'} (UTC)</span>
                            </div>
                        </div>
                        <hr />

                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <span>{t('Presale End Time')}</span>
                            </div>

                            <div className='text-end'>
                                <span>{formattedEndDate ? formattedEndDate : 'N/A'} (UTC)</span>
                            </div>
                        </div>
                        <hr />

                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <span>{t('Whitelisting Status')}</span>
                            </div>

                            <div className='text-end'>
                                <span>
                                    {presaleSaleDetails ? presaleSaleDetails.isWhiteListingEnabled ? t('Active') : t('Inactive') : t('N/A')}
                                </span>
                            </div>
                        </div>

                        {
                            presaleSaleDetails?.isWhiteListingEnabled &&
                            <WhitelistedTable poolAddress={presaleAddress} refreshWhitelist={refreshWhitelist} setRefreshWhitelist={setRefreshWhitelist} />
                        }

                        <hr />
                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <span>{t('Public Sales Time (UTC)')}</span>
                            </div>

                            <div className='text-end'>
                                <span>
                                    {
                                        presaleSaleDetails ? presaleSaleDetails.publicSaleStartTimestamp !== "0" ?
                                            DateTime.fromSeconds(parseInt(presaleSaleDetails.publicSaleStartTimestamp), { zone: "utc" }).toFormat("yyyy-MM-dd HH:mm:ss") : 'N/A' : 'N/A'}
                                </span>
                            </div>
                        </div>
                        <hr />

                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <span>{t('Listing On')}</span>
                            </div>

                            <div className='text-end'>
                                <a
                                    href={getLiquidityProviderDetailsByRouterAddress(presaleSaleDetails?.routerAddress)?.website}
                                    rel="noreferrer"
                                    target="_blank"
                                    style={{ wordBreak: 'break-all' }}>
                                    {getLiquidityProviderDetailsByRouterAddress(presaleSaleDetails?.routerAddress)?.providerName}
                                </a>
                            </div>
                        </div>
                        <hr />

                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <span>{t('Liquidity Percent')}</span>
                            </div>

                            <div className='text-end'>
                                <span>
                                    {presaleSaleDetails ? presaleSaleDetails?.liquidityPercentage : ''}%
                                </span>
                            </div>
                        </div>
                        <hr />

                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <span>{t('Liquidity Lock For')}</span>
                            </div>

                            <div className='text-end'>
                                <span>{liquidityUnlockTime ? liquidityUnlockTime : t('N/A')} days</span>
                            </div>
                        </div>
                        <hr />


                    </div>
                </Col>
            </Row>
        </Card>
    )
}

export default PoolTokenDetails