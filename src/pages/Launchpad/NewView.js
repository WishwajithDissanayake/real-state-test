import { Button, Spin } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import SocialDetails from './Review/SocialDetails';
import ReactHtmlParser from 'react-html-parser';
import './Launchpad.css'
import { LoadingOutlined } from '@ant-design/icons';
import PresaleDetails from './Review/PresaleDetails';

function NewView(props) {

    const { t } = useTranslation();

    const {
        setStepNumberParent,
        realStateName,
        realStateLocation,
        realStateWebsite,
        realStateImageUrl,
        realStateCoverImageUrl,
        realStateOtherImageUrl,
        facebookLink,
        twitterLink,
        githubLink,
        telegramLink,
        instagramLink,
        discordLink,
        redditLink,
        youtubeLink,
        description,
        isNextButtonActive,
        propertyPrice,
        tokensPerUSD,
        minimumBuy,
        maximumBuy,
        startTime,
        endTime,
        isWhitelistingEnabled,
        publicSaleStartTime,
    } = props;

    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 18,
                color: '#fff',
            }}
            spin
        />
    );
    return (
        <div className='review-info-area'>
            {/* Presale Details Component */}
            <PresaleDetails
                realStateName={realStateName}
                realStateLocation={realStateLocation}
                propertyPrice={propertyPrice}
                realStateImageUrl={realStateImageUrl}
                realStateCoverImageUrl={realStateCoverImageUrl}
                realStateOtherImageUrl={realStateOtherImageUrl}
                tokensPerUSD={tokensPerUSD}
                minimumBuy={minimumBuy}
                maximumBuy={maximumBuy}
                startTime={startTime}
                endTime={endTime}
                isWhitelistingEnabled={isWhitelistingEnabled}
                publicSaleStartTime={publicSaleStartTime}
            />

            {/* Social Details component */}
            <SocialDetails
                realStateWebsite={realStateWebsite}
                facebookLink={facebookLink}
                twitterLink={twitterLink}
                githubLink={githubLink}
                telegramLink={telegramLink}
                instagramLink={instagramLink}
                discordLink={discordLink}
                redditLink={redditLink}
                youtubeLink={youtubeLink}
                description={ReactHtmlParser(description)}
            />

            <Row>
                <Col lg="12" md="12" sm="12" className='text-center'>
                    <Button onClick={() => setStepNumberParent(1)} style={{ marginRight: '5px' }} className="mt-3">Go Back</Button>
                    <Button
                        className='mt-3'
                        // onClick={handlePresalePoolCreate}
                        // disabled={isPoolCreateDisabled}
                        type="primary">{t('Create Presale')}
                    </Button>

                    {/* 
                    {
                        !isTokenApprovalLoading &&
                        <Button
                            className="mt-3"
                            onClick={handleApproveToken}
                            disabled={isApproveButtonDisabled}
                            style={{ marginRight: '5px' }}
                            type="primary">{t('Approve Tokens')}
                        </Button>
                    } */}

                    {/* {
                        isTokenApprovalLoading &&
                        <Button
                            className="mt-3"
                            style={{ marginRight: '5px' }}
                            type="primary"><Spin indicator={antIcon} style={{ marginTop: '-7px', marginRight: '5px' }} />{t('Approve Tokens')}
                        </Button>
                    } */}

                    {/* {
                        !isPresalePoolCreationLoading &&
                        <Button
                            className='mt-3'
                            onClick={handlePresalePoolCreate}
                            disabled={isPoolCreateDisabled}
                            type="primary">{t('Create Presale')}
                        </Button>
                    } */}

                    {/* {
                        isPresalePoolCreationLoading &&
                        <Button
                            className='mt-3'
                            disabled={isPoolCreateDisabled}
                            type="primary"><Spin indicator={antIcon} style={{ marginTop: '-7px', marginRight: '5px' }} />
                            Create Presale
                        </Button>
                    } */}


                </Col>
            </Row>
        </div>
    )
}

export default NewView