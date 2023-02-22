import { Card } from 'antd'
import React from 'react'
import { Row, Col } from 'reactstrap'
import DisclaimerText from './DisclaimerText'

import fees from '../../images/dashboard/Fees.png'
import tokendist from '../../images/dashboard/Token Distribution.png'
import community from '../../images/dashboard/Community.png'
import kinglock from '../../images/dashboard/KingLock.png'
import kingstake from '../../images/dashboard/KingStake.png'
import trending from '../../images/dashboard/Trending.png'
import kyc from '../../images/dashboard/KYC.png'
import verified from '../../images/dashboard/Verfied Pre-sale.png'
import { useTranslation } from 'react-i18next';

function FeaturesSection() {
    const { t } = useTranslation();

    return (
        <div className='mb-5 mt-5'>
            <div className='text-center col-lg-10 mx-auto'>
                <h2 className='fw-bold'>{t('Kingly Features for')} <span className='primary-text'>{t('Token Presales')}</span></h2>

                <p className='fw-normal'>{t('FEATURE_SECTION_INTRO')}</p>
            </div>

            <div className='mt-5'>

                <Row className='col-lg-12 col-md-12 col-sm-11 mx-auto'>
                    <Col className='mt-3' lg="3" md="3" sm="12">
                        <a href='https://docs.kingsale.finance/fees' target="_blank" rel="noreferrer">
                            <Card className='feature-card h-100 text-center'>
                                <img src={fees} alt="fees" style={{ width: '70px', height: '65px', marginBottom: '10px' }} />
                                <h6 className='fw-bold mt-2'>{t('Fees')}</h6>
                                <p className='text-muted small fw-bold'>{t('3% of BNB/USDT raised through the presale. 0% of token supply to give each project their best chance.')}</p>
                            </Card>
                        </a>
                    </Col>

                    <Col className='mt-3' lg="3" md="3" sm="12">
                        <a href='https://docs.kingsale.finance/community-voting' target="_blank" rel="noreferrer">
                            <Card className='feature-card h-100 text-center'>
                                <img src={community} alt="community" style={{ width: '70px', height: '70px', marginBottom: '10px' }} />
                                <h6 className='fw-bold mt-2'>{t('Community Participation')}</h6>
                                <p className='text-muted small fw-bold'>{t('Vote on project safety and other features.')}</p>
                            </Card>
                        </a>
                    </Col>


                    <Col className='mt-3' lg="3" md="3" sm="12">
                        <a href='https://docs.kingsale.finance/how-to-use-kingsale/locking-lp-and-tokens' target="_blank" rel="noreferrer">
                            <Card className='feature-card h-100 text-center'>
                                <img src={kinglock} alt="kinglock" style={{ width: '70px', height: '70px', marginBottom: '10px' }} />
                                <h6 className='fw-bold mt-2'>{t('King Lock')}</h6>
                                <p className='text-muted small fw-bold'>{t('Give investors security and confidence by locking liquidity and team tokens through us.')}</p>
                            </Card>
                        </a>
                    </Col>

                    <Col className='mt-3' lg="3" md="3" sm="12">
                        <a href='https://docs.kingsale.finance/verified-presale' target="_blank" rel="noreferrer">
                            <Card className='feature-card h-100 text-center'>
                                <img src={verified} alt="verified" style={{ width: '70px', height: '70px', marginBottom: '10px' }} />
                                <h6 className='fw-bold mt-2'>{t('Verified Presale Page Badge')}</h6>
                                <p className='text-muted small fw-bold'>
                                    {t('Have confidence in knowing the presale you are investing into has been verified to be the official page when given the Verified Presale Page Badge.')}
                                </p>
                            </Card>
                        </a>
                    </Col>


                    <Col className='mt-3' lg="3" md="3" sm="12">
                        <a href='https://docs.kingsale.finance/how-to-use-kingsale/creating-a-staking-pool' target="_blank" rel="noreferrer">
                            <Card className='feature-card h-100 text-center'>
                                <img src={kingstake} alt="kingstake" style={{ width: '70px', height: '70px', marginBottom: '10px' }} />
                                <h6 className='fw-bold mt-2'>{t('King Staking')}</h6>
                                <p className='text-muted small fw-bold'>{t('A place to create or participate in staking pools for all tokens.')}</p>
                            </Card>
                        </a>
                    </Col>


                    <Col className='mt-3' lg="3" md="3" sm="12">
                        <a href='https://docs.kingsale.finance/additional-features/kyc-and-audit' target="_blank" rel="noreferrer">
                            <Card className='feature-card h-100 text-center'>
                                <img src={kyc} alt="kyc" style={{ width: '70px', height: '70px', marginBottom: '10px' }} />
                                <h6 className='fw-bold mt-2'>{t('KYC Feature')}</h6>
                                <p className='text-muted small fw-bold'>{t('We offer KYC to developers to give their investors more peace of mind.')}</p>
                            </Card>
                        </a>
                    </Col>


                    <Col className='mt-3' lg="3" md="3" sm="12">
                        <Card className='feature-card h-100 text-center'>
                            <img src={tokendist} alt="token_dist" style={{ width: '70px', height: '70px', marginBottom: '10px' }} />
                            <h6 className='fw-bold mt-2'>{t('Token Distrubution')}</h6>
                            <p className='text-muted small fw-bold'>{t('Check the token distibution of each presale.')}</p>
                        </Card>
                    </Col>

                    <Col className='mt-3' lg="3" md="3" sm="12">
                        <Card className='feature-card h-100 text-center'>
                            <img src={trending} alt="trending" style={{ width: '70px', height: '70px', marginBottom: '10px' }} />
                            <h6 className='fw-bold mt-2'>{t('Trending Service')}</h6>
                            <p className='text-muted small fw-bold'>{t('Track promising upcoming projects through the KingSale trending banner. Trending rank is measured from user engagement and is not a paid service.')}</p>
                        </Card>
                    </Col>

                </Row>
                
                <Row className='mt-4'>
                    <Col className='col-lg-12 col-md-12 col-sm-11 text-center'>
                        <DisclaimerText />
                    </Col>
                </Row>

            </div>
        </div>
    )
}

export default FeaturesSection