import React from 'react'
import { Avatar, Card, Image } from 'antd'
import { Col, Row } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import './Review.css'

function PresaleDetails(props) {

    const { t } = useTranslation();
    const {
        realStateName,
        realStateLocation,
        propertyPrice,
        realStateImageUrl,
        realStateCoverImageUrl,
        realStateOtherImageUrl,
        tokensPerUSD,
        minimumBuy,
        maximumBuy,
        startTime,
        endTime,
        isWhitelistingEnabled,
        publicSaleStartTime,
    } = props;

    return (
        <div>
            <Card title="Presale Details" className='review-info-card mt-4'>
                <Row>   {realStateCoverImageUrl &&
                    <Col lg="12" md="12" sm="12" className='text-center'>
                        <div className='m-1'>
                            {realStateCoverImageUrl ? <Image
                                className='real-estate-cover-image'
                                src={realStateCoverImageUrl}
                            /> : t('N/A')}
                        </div>
                    </Col>
                }
                </Row>
                <Row>
                    <Col lg="2" md="2" sm="2">
                        {realStateImageUrl &&
                            <div className='real-state-image-alignment m-1 pt-2'>
                                {realStateImageUrl ? <Avatar
                                    size={80}
                                    src={realStateImageUrl}
                                /> : t('N/A')}
                            </div>
                        }
                    </Col>
                    <Col lg="5" md="5" sm="5">
                        {realStateName &&
                            <div className='text-center pt-2'>
                                <div className='d-flex real-estate-name-location-align'>
                                    <div className='text-start m-2'>
                                        <h5>Name : </h5>
                                    </div>
                                    <div className='m-2  text-center'>
                                        {realStateName ? <h5>{realStateName}</h5> : t('N/A')}
                                    </div>
                                </div>
                            </div>
                        }
                    </Col>
                    <Col lg="5" md="5" sm="5">
                        {realStateLocation &&
                            <div className='text-center pt-2'>
                                <div className='d-flex real-estate-name-location-align'>
                                    <div className='text-start m-2'>
                                        <h5>Location : </h5>
                                    </div>
                                    <div className='m-2  text-center'>
                                        {realStateLocation ? <h5>{realStateLocation}</h5> : t('N/A')}
                                    </div>
                                </div>
                            </div>
                        }
                    </Col>
                </Row>
                <Row>   {realStateOtherImageUrl &&
                    <Col lg="12" md="12" sm="12">
                        <div className='m-1 pb-2 pt-2 hidden-mobile text-center'>
                            <Image
                                width={190}
                                height={150}
                                className='other-image-alignment'
                                src={realStateOtherImageUrl}
                            />
                            <Image
                                width={190}
                                height={150}
                                className='other-image-alignment'
                                src={realStateOtherImageUrl}
                            />
                            <Image
                                width={190}
                                height={150}
                                className='other-image-alignment'
                                src={realStateOtherImageUrl}
                            />
                            <Image
                                width={190}
                                height={150}
                                className='other-image-alignment'
                                src={realStateOtherImageUrl}
                            />
                            <Image
                                width={190}
                                height={150}
                                className='other-image-alignment'
                                src={realStateOtherImageUrl}
                            />
                        </div>
                    </Col>
                }
                </Row>
                <Row>   {realStateOtherImageUrl &&
                    <Col lg="12" md="12" sm="12">
                        <div className='m-1 pb-2 pt-2 hidden-large-screen text-center'>
                            <Image
                                className='real-estate-cover-image'
                                src={realStateOtherImageUrl}
                            />
                            <Image
                                className='real-estate-cover-image'
                                src={realStateOtherImageUrl}
                            />
                            <Image
                                className='real-estate-cover-image'
                                src={realStateOtherImageUrl}
                            />
                            <Image
                                className='real-estate-cover-image'
                                src={realStateOtherImageUrl}
                            />
                            <Image
                                className='real-estate-cover-image'
                                src={realStateOtherImageUrl}
                            />
                        </div>
                    </Col>
                }
                </Row>
                <div className='other-details'>
                    <Col lg="12" md="12" sm="12">
                        {propertyPrice &&
                            <div className='d-flex justify-content-between'>
                                <div className='text-start'>
                                    <p>{t('Real State Price')}</p>
                                </div>
                                <div className='text-end'>
                                    {propertyPrice ? '$' + propertyPrice : t('N/A')}
                                </div>
                            </div>
                        }
                    </Col>
                    <Col lg="12" md="12" sm="12">
                        {tokensPerUSD &&
                            <div className='d-flex justify-content-between'>
                                <div className='text-start'>
                                    <p>{t('Tokens Per USD')}</p>
                                </div>
                                <div className='text-end'>
                                    {tokensPerUSD ? tokensPerUSD : t('N/A')}
                                </div>
                            </div>
                        }
                    </Col>
                    <Col lg="12" md="12" sm="12">
                        {minimumBuy &&
                            <div className='d-flex justify-content-between'>
                                <div className='text-start'>
                                    <p>{t('Minimum Buy')}</p>
                                </div>
                                <div className='text-end'>
                                    {minimumBuy ? '$' + minimumBuy : t('N/A')}
                                </div>
                            </div>
                        }
                    </Col>
                    <Col lg="12" md="12" sm="12">
                        {maximumBuy &&
                            <div className='d-flex justify-content-between'>
                                <div className='text-start'>
                                    <p>{t('Maximum Buy')}</p>
                                </div>
                                <div className='text-end'>
                                    {maximumBuy ? '$' + maximumBuy : t('N/A')}
                                </div>
                            </div>
                        }
                    </Col>
                    <Col lg="12" md="12" sm="12">
                        {startTime &&
                            <div className='d-flex justify-content-between'>
                                <div className='text-start'>
                                    <p>{t('Start Time')}</p>
                                </div>
                                <div className='text-end'>
                                    {startTime ? startTime : t('N/A')}
                                </div>
                            </div>
                        }
                    </Col>
                    <Col lg="12" md="12" sm="12">
                        {endTime &&
                            <div className='d-flex justify-content-between'>
                                <div className='text-start'>
                                    <p>{t('End Time')}</p>
                                </div>
                                <div className='text-end'>
                                    {endTime ? endTime : t('N/A')}
                                </div>
                            </div>
                        }
                    </Col>
                    <Col lg="12" md="12" sm="12">
                        {publicSaleStartTime &&
                            <div className='d-flex justify-content-between'>
                                <div className='text-start'>
                                    <p>{t('Public Sale Start Time')}</p>
                                </div>
                                <div className='text-end'>
                                    {publicSaleStartTime ? publicSaleStartTime : t('N/A')}
                                </div>
                            </div>
                        }
                    </Col>
                </div>
            </Card>
        </div>
    )
}

export default PresaleDetails;

