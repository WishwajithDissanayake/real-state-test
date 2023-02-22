import React from "react"
import { Card } from 'antd'
import { useTranslation } from 'react-i18next';
import './Review.css'

function SocialDetails(props) {

    const { t } = useTranslation();
    const {
        realStateWebsite,
        facebookLink,
        twitterLink,
        telegramLink,
        githubLink,
        instagramLink,
        discordLink,
        redditLink,
        description,
        youtubeLink,
        // kycLink,
        // auditedLink,
        // safuLink,
        // poocoinLink
    } = props

    return (
        <div>
            <Card title="Social Details" className='review-info-card mt-4'>
                <div className="other-details">
                    {realStateWebsite &&
                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <p>{t('Real State Website')}</p>
                            </div>

                            <div className='text-end'>
                                {realStateWebsite ? realStateWebsite : t('N/A')}
                            </div>
                        </div>
                    }

                    {facebookLink &&
                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <p>{t('Facebook')}</p>
                            </div>

                            <div className='text-end'>
                                {facebookLink ? facebookLink : t('N/A')}
                            </div>
                        </div>
                    }

                    {twitterLink &&
                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <p>{t('Twitter')}</p>
                            </div>

                            <div className='text-end'>
                                {twitterLink ? twitterLink : t('N/A')}
                            </div>
                        </div>
                    }

                    {telegramLink &&
                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <p>{t('Telegram')}</p>
                            </div>

                            <div className='text-end'>
                                {telegramLink ? telegramLink : t('N/A')}
                            </div>
                        </div>
                    }

                    {githubLink &&
                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <p>{t('Github')}</p>
                            </div>

                            <div className='text-end'>
                                {githubLink ? githubLink : t('N/A')}
                            </div>
                        </div>
                    }

                    {instagramLink &&
                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <p>{t('Instagram')}</p>
                            </div>

                            <div className='text-end'>
                                {instagramLink ? instagramLink : t('N/A')}
                            </div>
                        </div>
                    }

                    {discordLink &&
                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <p>{t('Discord')}</p>
                            </div>

                            <div className='text-end'>
                                {discordLink ? discordLink : t('N/A')}
                            </div>
                        </div>
                    }

                    {redditLink &&
                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <p>{t('Reddit')}</p>
                            </div>

                            <div className='text-end'>
                                {redditLink ? redditLink : t('N/A')}
                            </div>
                        </div>
                    }

                    {youtubeLink &&
                        <div className='d-flex justify-content-between'>
                            <div className='text-start'>
                                <p>{t('Youtube Video Link')}</p>
                            </div>

                            <div className='text-end'>
                                {youtubeLink ? youtubeLink : t('N/A')}
                            </div>
                        </div>
                    }

                    {/* {kycLink &&
                    <div className='d-flex justify-content-between'>
                        <div className='text-start'>
                            <p>{t('KYC Link')}</p>
                        </div>

                        <div className='text-end'>
                            {kycLink ? kycLink : t('N/A')}
                        </div>
                    </div>
                } */}

                    {/* {auditedLink &&
                    <div className='d-flex justify-content-between'>
                        <div className='text-start'>
                            <p>{t('Audited Link')}</p>
                        </div>

                        <div className='text-end'>
                            {auditedLink ? auditedLink : t('N/A')}
                        </div>
                    </div>
                } */}

                    {/* {safuLink &&
                    <div className='d-flex justify-content-between'>
                        <div className='text-start'>
                            <p>{t('Safu Link')}</p>
                        </div>

                        <div className='text-end'>
                            {safuLink ? safuLink : t('N/A')}
                        </div>
                    </div>
                } */}

                    {/* {poocoinLink &&
                    <div className='d-flex justify-content-between'>
                        <div className='text-start'>
                            <p>{t('Poocoin Link')}</p>
                        </div>

                        <div className='text-end'>
                            {poocoinLink ? poocoinLink : t('N/A')}
                        </div>
                    </div>
                } */}

                    {description &&
                        <div className='d-flex row' style={{ overflow: 'hidden' }}>
                            <div className='text-start'>
                                <p>{t('Description')} :</p>
                            </div>

                            <div className='text-start fit-inside'>
                                {description ? description : t('N/A')}
                            </div>
                        </div>
                    }
                </div>
            </Card>
        </div>
    )
}

export default SocialDetails