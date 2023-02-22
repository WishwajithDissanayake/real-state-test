import { Button, Card } from 'antd'
import React, { useEffect } from 'react'
import { Row, Col } from 'reactstrap'
import ReactReadMoreReadLess from "react-read-more-read-less";
import Social from '../PresaleDetails/Social';
import { useTranslation } from 'react-i18next';

// influencer partner logos
import gollums_gems from '../../images/partnerships/gollums_gems.jpeg'
import fluffys_fortune from '../../images/partnerships/fluffys_fortune.jpeg'
import the_green_room from '../../images/partnerships/the_green_room.jpeg'
import rudes_crypto_launge from '../../images/partnerships/rudes_crypto_launge.jpeg'
import travvlad_crypto from '../../images/partnerships/travvlad_crypto.jpeg'

// product partner logos
import fibswap_dex from '../../images/partnerships/fibswap_dex.jpeg'
import taste_dex from '../../images/partnerships/taste_dex.jpeg'
import knightswap_finance from '../../images/partnerships/knightswap_finance.jpeg'

function Partnership() {

    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    const influencer_pertners_col_1 = [
        {
            id: 1,
            name: t('Gollum’s Gems'),
            desc: t('GOLLUMS_GEMS_DESC'),
            telegramLink: 'https://t.me/gollumsgems',
            twitterLink: 'https://twitter.com/Gollumsgems',
            logo: gollums_gems
        },
        {
            id: 2,
            name: t('The Green Room'),
            desc: t('THE_GREEN_ROOM_DESC'),
            telegramLink: 'https://t.me/THEGREENROOOOM',
            logo: the_green_room
        },
        // {
        //     id: 3,
        //     name: t('Travladd Crypto'),
        //     desc: t('TRAVLADD_DESC'),
        //     twitterLink: 'https://twitter.com/OfficialTravlad',
        //     telegramLink: 'https://t.me/travladdsafucalls',
        //     logo: travvlad_crypto
        // }
    ]

    const influencer_pertners_col_2 = [
        {
            id: 1,
            name: t('Fluffy’s Fortune'),
            desc: t('FLUFFYS_FORTUNE_DESC'),
            telegramLink: 'https://t.me/fluffysfortune',
            logo: fluffys_fortune
        },
        {
            id: 2,
            name: t('Rude’s Crypto Lounge'),
            desc: t('RUDES_CRYPTO_DESC'),
            telegramLink: 'https://t.me/RudesCLounge',
            logo: rudes_crypto_launge
        }
    ]

    const product_partners_col_1 = [
        {
            id: 1,
            name: t('FibSwap Dex'),
            desc: t('FIBSWAP_DEX_DESC'),
            telegramLink: 'https://t.me/FibSwapOfficial',
            discordLink: 'https://discord.gg/HNeHPWdE',
            twitterLink: 'https://twitter.com/FibSwap?s=20&t=WGPvupGpEY7s4df6xqwy6g',
            websiteLink: 'https://fibswap.io/',
            logo: fibswap_dex
        },
        {
            id: 2,
            name: t('KnightSwap Finance'),
            desc: t('KNIGHTSWAP_DESC'),
            telegramLink: 'https://t.me/knightswap',
            discordLink: 'https://discord.gg/rVuYT6DXjA',
            twitterLink: 'https://twitter.com/KnightEcosystem',
            websiteLink: 'https://app.knightswap.financial/',
            logo: knightswap_finance
        }
    ]

    const product_partners_col_2 = [
        {
            id: 1,
            name: t('Taste Dex'),
            desc: t('TASTE_DEX_DESC'),
            telegramLink: 'https://t.me/TasteNFT',
            discordLink: 'https://discord.st/TasteNFT/',
            twitterLink: 'https://twitter.com/tastenft',
            websiteLink: 'https://swap.tastenfts.com/swap',
            logo: taste_dex
        }
    ]

  return (
    <div className='mt-5 mb-5'>
        <div className='text-end'>
            <a href="https://docs.kingsale.finance/additional-features/project-promotion" target="_blank" rel="noreferrer">
                <Button className='kingsale-primary-button'>{t('Apply for Partnership')}</Button>
            </a>
        </div>

        <Row className='mt-4'>
            <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mt-3'>
                <Card className='h-100'>
                    <h5 className='text-center'>{t('Influencer Partners')}</h5>
                    <hr />

                    <Row>
                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12">
                            {
                                influencer_pertners_col_1.map(partner => (
                                    <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className='mt-3'>
                                        <Card className='kingsale-card-bg'>

                                            <img src={partner.logo} alt={partner.name} style={{width: '100%'}} />

                                            <h6 className='mt-3'>{partner.name}</h6>
                                            <ReactReadMoreReadLess
                                                charLimit={30}
                                                readMoreText={<span className='primary-text'>Read more ▼</span>}
                                                readLessText={<span className='primary-text'>Read less ▲</span>}
                                            >
                                                {partner.desc}
                                            </ReactReadMoreReadLess>

                                            <div className='mt-2'>
                                                <Social presaleDetails={partner} isPresaleLoading={false} />
                                            </div>
                                        </Card>
                                    </Col>
                                ))
                            }
                        </Col>

                        <Col>
                        {
                            influencer_pertners_col_2.map(partner => (
                                <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className='mt-3'>
                                    <Card className='kingsale-card-bg'>

                                        <img src={partner.logo} alt={partner.name} style={{width: '100%'}} />

                                        <h6 className='mt-3'>{partner.name}</h6>
                                        <ReactReadMoreReadLess
                                            charLimit={30}
                                            readMoreText={<span className='primary-text'>Read more ▼</span>}
                                            readLessText={<span className='primary-text'>Read less ▲</span>}
                                        >
                                            {partner.desc}
                                        </ReactReadMoreReadLess>

                                        <div className='mt-2'>
                                            <Social presaleDetails={partner} isPresaleLoading={false} />
                                        </div>
                                    </Card>
                                </Col>
                            ))
                        }
                        </Col>
                    </Row>
                </Card>
                
            </Col>


            <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mt-3'>
                <Card className='h-100'>
                    <h5 className='text-center'>{t('Product Partners')}</h5>
                    <hr />

                    <Row>
                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12">
                            {
                                product_partners_col_1.map(partner => (
                                    <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className='mt-3'>
                                        <Card className='kingsale-card-bg'>

                                            <img src={partner.logo} alt={partner.name} style={{width: '100%'}} />

                                            <h6 className='mt-3'>{partner.name}</h6>
                                            <ReactReadMoreReadLess
                                                charLimit={30}
                                                readMoreText={<span className='primary-text'>Read more ▼</span>}
                                                readLessText={<span className='primary-text'>Read less ▲</span>}
                                            >
                                                {partner.desc}
                                            </ReactReadMoreReadLess>

                                            <div className='mt-2'>
                                                <Social presaleDetails={partner} isPresaleLoading={false} />
                                            </div>
                                        </Card>
                                    </Col>
                                ))
                            }
                        </Col>

                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12">
                            {
                                product_partners_col_2.map(partner => (
                                    <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className='mt-3'>
                                        <Card className='kingsale-card-bg'>

                                            <img src={partner.logo} alt={partner.name} style={{width: '100%'}} />

                                            <h6 className='mt-3'>{partner.name}</h6>
                                            <ReactReadMoreReadLess
                                                charLimit={30}
                                                readMoreText={<span className='primary-text'>Read more ▼</span>}
                                                readLessText={<span className='primary-text'>Read less ▲</span>}
                                            >
                                                {partner.desc}
                                            </ReactReadMoreReadLess>

                                            <div className='mt-2'>
                                                <Social presaleDetails={partner} isPresaleLoading={false} />
                                            </div>
                                        </Card>
                                    </Col>
                                ))
                            }
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default Partnership