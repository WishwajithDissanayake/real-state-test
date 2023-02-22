import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Card, Upload, notification } from 'antd'
import { Row, Col } from 'reactstrap'
import {
    LinkOutlined,
    GlobalOutlined,
    FacebookFilled,
    TwitterOutlined,
    GithubOutlined,
    RedditOutlined,
    InstagramFilled,
    YoutubeOutlined,
    UploadOutlined
} from '@ant-design/icons'
import BundledEditor from '../../helpers/BundledEditor';
import { useTranslation } from 'react-i18next';
import telegram from '../../images/telegram.png'
import discord from '../../images/discord.png'
import AWS from 'aws-sdk'
import moment from 'moment';

AWS.config.update({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY
})

const myBucket = new AWS.S3({
    params: { Bucket: process.env.REACT_APP_S3_BUCKET },
    region: process.env.REACT_APP_REGION,
})

function AdditionalInfo(props) {

    const { t } = useTranslation();

    const {
        setStepNumberParent,
        logoURL,
        setLogoURL,
        coverImageUrl,
        setCoverImageUrl,
        website,
        setWebsite,
        facebookLink,
        setFacebookLink,
        twitterLink,
        setTwitterLink,
        githubLink,
        setGithubLink,
        telegramLink,
        setTelegramLink,
        instagramLink,
        setInstagramLink,
        discordLink,
        setDiscordLink,
        redditLink,
        setRedditLink,
        description,
        setDescription,
        youtubeLink,
        setYoutubeLink,
        kycLink,
        setKycLink,
        auditedLink,
        setAuditedLink,
        safuLink,
        setSafuLink,
        poocoinLink,
        setPoocoinLink
    } = props

    const editorRef = useRef(null)
    const [logoURLValidationMessage, setLogoURLValidationMessage] = useState(null)
    const [logoURLValidationStatus, setLogoURLValidationStatus] = useState(null)

    const [coverURLValidationMessage, setCoverURLValidationMessage] = useState(null)
    const [coverURLValidationStatus, setCoverURLValidationStatus] = useState(null)

    const [websiteValidationMessage, setWebsiteValidationMessage] = useState(null)
    const [websiteValidationStatus, setWebsiteValidationStatus] = useState(null)

    const [youtubeValidationMessage, setYoutubeValidationMessage] = useState(null)
    const [youtubeValidationStatus, setYoutubeValidationStatus] = useState(null)

    const [kycValidationMessage, setKycValidationMessage] = useState(null)
    const [kycValidationStatus, setKycValidationStatus] = useState(null)

    const [auditedValidationMessage, setAuditedValidationMessage] = useState(null)
    const [auditedValidationStatus, setAuditedValidationStatus] = useState(null)

    const [safuValidationMessage, setSafuValidationMessage] = useState(null)
    const [safuValidationStatus, setSafuValidationStatus] = useState(null)

    const [pooCoinValidationMessage, setpooCoinValidationMessage] = useState(null)
    const [pooCoinValidationStatus, setpooCoinValidationStatus] = useState(null)

    const [canProceedToNextStep, setCanProceedToNextStep] = useState(false)

    const [uploadedLogoFile, setUploadedLogoFile] = useState(null)
    const [uploadedCoverFile, setUploadedCoverFile] = useState(null)
    const [isLogoUploading, setIsLogoUploading] = useState(false)
    const [isCoverImgUploading, setIsCoverImgUploading] = useState(false)

    const key = 'updatable';

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const isValidUrl = (url) => {
        try {
            return Boolean(new URL(url));
        }
        catch (e) {
            return false;
        }
    }

    const isValidYoutubeUrl = (url) => {
        try {
            var regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
            if (url.match(regExp)) {
                return true;
            }
        } catch (e) {
            return false
        }
    }

    const isValidImageURL = (url) => {
        try {
            var regExp = /^https?:\/\/.*\/.*\.(jpeg|jpg|gif|png|JPG|JPEG|GIF|PNG)\??.*$/gmi
            if (url.match(regExp)) {
                return true;
            }
        } catch (error) {
            return false
        }
        // return (url.match(/(?:https?:\/\/)?\.(jpeg|jpg|gif|png|JPG|JPEG|GIF|PNG)$/) != null)
    }

    const onFinish = (values) => {
        setStepNumberParent(3)
    }

    useEffect(() => {
        if (safuLink) {
            if (isValidUrl(safuLink)) {
                setSafuValidationStatus('success')
                setSafuValidationMessage(null)
                setCanProceedToNextStep(true)
            } else {
                setSafuValidationStatus('error')
                setSafuValidationMessage(t("Invalid safu url"))
                setCanProceedToNextStep(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [safuLink])

    useEffect(() => {
        if (auditedLink) {
            if (isValidUrl(auditedLink)) {
                setAuditedValidationStatus('success')
                setAuditedValidationMessage(null)
                setCanProceedToNextStep(true)
            } else {
                setAuditedValidationStatus('error')
                setAuditedValidationMessage(t("Invalid audited url"))
                setCanProceedToNextStep(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auditedLink])

    useEffect(() => {
        if (kycLink) {
            if (isValidUrl(kycLink)) {
                setKycValidationStatus('success')
                setKycValidationMessage(null)
                setCanProceedToNextStep(true)
            } else {
                setKycValidationStatus('error')
                setKycValidationMessage(t("Invalid kyc url"))
                setCanProceedToNextStep(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kycLink])

    useEffect(() => {
        if (logoURL) {
            if (isValidImageURL(logoURL)) {
                setLogoURLValidationStatus('success')
                setLogoURLValidationMessage(null)
                setCanProceedToNextStep(true)
            } else {
                setLogoURLValidationStatus('error')
                setLogoURLValidationMessage(t("Invalid logo URL. Enter the direct URL to the logo in .png, .jpg or .gif format"))
                setCanProceedToNextStep(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [logoURL])

    useEffect(() => {
        if (coverImageUrl) {
            if (isValidImageURL(coverImageUrl)) {
                setCoverURLValidationStatus('success')
                setCoverURLValidationMessage(null)
                setCanProceedToNextStep(true)
            } else {
                setCoverURLValidationStatus('error')
                setCoverURLValidationMessage(t("Invalid logo URL. Enter the direct URL to the logo in .png, .jpg or .gif format"))
                setCanProceedToNextStep(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coverImageUrl])

    useEffect(() => {
        if (website) {
            if (isValidUrl(website)) {
                setWebsiteValidationStatus('success')
                setWebsiteValidationMessage(null)
                setCanProceedToNextStep(true)
            } else {
                setWebsiteValidationStatus('error')
                setWebsiteValidationMessage(t("Invalid website url"))
                setCanProceedToNextStep(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [website])

    useEffect(() => {
        if (youtubeLink) {
            if (isValidYoutubeUrl(youtubeLink)) {
                setYoutubeValidationStatus('success')
                setYoutubeValidationMessage(null)
                setCanProceedToNextStep(true)
            } else {
                setYoutubeValidationStatus('error')
                setYoutubeValidationMessage(t("Invalid video url"))
                setCanProceedToNextStep(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [youtubeLink])

    useEffect(() => {
        if (poocoinLink) {
            if (isValidUrl(poocoinLink)) {
                setpooCoinValidationStatus('success')
                setpooCoinValidationMessage(null)
                setCanProceedToNextStep(true)
            } else {
                setpooCoinValidationStatus('error')
                setpooCoinValidationMessage(t("Invalid poocoin url"))
                setCanProceedToNextStep(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [poocoinLink])

    const uploadConfigs = {
        onRemove: () => {
            setUploadedLogoFile(null)
            setLogoURL(null)
        },
        beforeUpload: (file) => {
            const isPNG = file.type === 'image/png'
            const isJPG = file.type === 'image/jpg'
            const isJPEG = file.type === 'image/jpeg'
            const isGIF = file.type === 'image/gif'

            if (isPNG || isJPG || isJPEG || isGIF) {
                let fileSize = file.size / 1024 / 1024; // in MiB
                console.log(fileSize)
                if (fileSize <= 5) {
                    setUploadedLogoFile(file)
                } else {
                    setUploadedLogoFile(null)
                    setLogoURL(null)
                    setLogoURLValidationStatus('error')
                    notification['error']({
                        key,
                        message: t('Invalid File Size'),
                        description:
                            t('Please select a file less than 5MB'),
                    })
                }
            } else {
                notification['error']({
                    key,
                    message: t('Invalid File Type'),
                    description:
                        t('Please upload .png, .jpg, .jpeg or .gif formats'),
                })
                return false
            }
            return false
        },
    }

    const uploadCoverImgConfigs = {
        onRemove: () => {
            setUploadedCoverFile(null)
            setCoverImageUrl(null)
        },
        beforeUpload: (file) => {
            const isPNG = file.type === 'image/png'
            const isJPG = file.type === 'image/jpg'
            const isJPEG = file.type === 'image/jpeg'
            const isGIF = file.type === 'image/gif'

            if (isPNG || isJPG || isJPEG || isGIF) {
                let fileSize = file.size / 1024 / 1024; // in MiB
                console.log(fileSize)
                if (fileSize <= 5) {
                    setUploadedCoverFile(file)
                } else {
                    setUploadedCoverFile(null)
                    setCoverImageUrl(null)
                    setCoverURLValidationStatus('error')
                    notification['error']({
                        key,
                        message: t('Invalid File Size'),
                        description:
                            t('Please select a file less than 5MB'),
                    })
                }
            } else {
                notification['error']({
                    key,
                    message: t('Invalid File Type'),
                    description:
                        t('Please upload .png, .jpg, .jpeg or .gif formats'),
                })
                return false
            }
            return false
        },
    }

    const uploadFileToAWS = () => {
        setLogoURLValidationStatus('validating')
        setLogoURL('')
        setIsLogoUploading(true)

        const fileExtension = uploadedLogoFile.name.split('.').pop()
        const timestamp = moment().valueOf()
        const fileName = `${timestamp}.${fileExtension}`

        const params = {
            ACL: 'public-read',
            Body: uploadedLogoFile,
            Bucket: process.env.REACT_APP_S3_BUCKET,
            Key: fileName
        };

        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                const progress = Math.round((evt.loaded / evt.total) * 100)
                console.log("Progress", progress)
            })
            .send((error, data) => {
                if (!error) {
                    const uploadedFileURI = `https://${process.env.REACT_APP_S3_BUCKET}.s3.amazonaws.com/${fileName}`
                    console.log(uploadedFileURI)
                    setLogoURL(uploadedFileURI)
                    notification['success']({
                        key,
                        message: t('File Uploaded'),
                        description:
                            t('Logo has been uploaded'),
                    })
                    setLogoURLValidationMessage(null)
                    setLogoURLValidationStatus('success')
                    setIsLogoUploading(false)
                } else {
                    setLogoURLValidationStatus('error')
                    setLogoURL('')
                    setIsLogoUploading(false)
                }

            })
    }

    const uploadCoverToAWS = () => {
        setCoverURLValidationStatus('validating')
        setCoverImageUrl('')
        setIsCoverImgUploading(true)

        const fileExtension = uploadedLogoFile.name.split('.').pop()
        const timestamp = moment().valueOf()
        const fileName = `${timestamp}.${fileExtension}`
        const params = {
            ACL: 'public-read',
            Body: uploadedCoverFile,
            Bucket: process.env.REACT_APP_S3_BUCKET,
            Key: fileName
        };

        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                const progress = Math.round((evt.loaded / evt.total) * 100)
                console.log("Progress", progress)
            })
            .send((error, data) => {
                if (!error) {
                    const uploadedFileURI = `https://${process.env.REACT_APP_S3_BUCKET}.s3.amazonaws.com/${fileName}`
                    console.log(uploadedFileURI)
                    setCoverImageUrl(uploadedFileURI)
                    notification['success']({
                        key,
                        message: t('File Uploaded'),
                        description:
                            'Cover Image has been uploaded',
                    })
                    setCoverURLValidationMessage(null)
                    setCoverURLValidationStatus('success')
                    setIsCoverImgUploading(false)
                } else {
                    setCoverURLValidationStatus('error')
                    setCoverImageUrl('')
                    setIsCoverImgUploading(false)
                }

            })
    }

    useEffect(() => {
        if (uploadedLogoFile) {
            uploadFileToAWS()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadedLogoFile])

    useEffect(() => {
        if (uploadedCoverFile) {
            uploadCoverToAWS()
        }
    }, [uploadedCoverFile])

    return (
        <div>
            <div className='mb-2'>
                <span className='text-validation-error'>(*) {t('is required field.')}</span>
            </div>
            <Form
                name="verify_token"
                onFinish={onFinish}
                initialValues={{
                    logoURL: logoURL,
                    coverImageUrl: coverImageUrl,
                    website: website,
                    facebookLink: facebookLink,
                    twitterLink: twitterLink,
                    githubLink: githubLink,
                    telegramLink: telegramLink,
                    instagramLink: instagramLink,
                    discordLink: discordLink,
                    redditLink: redditLink,
                    description: description,
                    youtubeLink: youtubeLink,
                    kycLink: kycLink,
                    auditedLink: auditedLink,
                    safuLink: safuLink,
                    poocoinLink: poocoinLink,
                }}
            >


                <Card title={t('Primary Presale Info')} className='review-info-card'>
                    <Row>
                        <Col lg="6" md="6" sm="12">
                            <span className='small'>{t('Logo URL')} <span className='required-field-warning'>*</span></span>
                            <Form.Item
                                name="logoURL"
                                validateStatus={logoURLValidationStatus}
                                help={logoURLValidationMessage}
                                hasFeedback
                                onChange={e => setLogoURL(e.target.value)}
                            >
                                <Input
                                    lang='en'
                                    disabled={isLogoUploading}
                                    value={logoURL}
                                    size="large"
                                    prefix={<LinkOutlined style={{ color: '#e6bd4f' }} />}
                                    placeholder="Recommended logo size: 600x600 pixels"
                                />
                                <Upload {...uploadConfigs} maxCount={1} listType="picture" >
                                    <Button
                                        style={{ marginTop: '10px' }}
                                        // onClick={}
                                        className='kingsale-primary-button'
                                    ><div className='d-flex'><UploadOutlined style={{ marginTop: '3px', marginRight: '4px' }} />Or Upload</div></Button>
                                </Upload>
                            </Form.Item>
                        </Col>


                        <Col lg="6" md="6" sm="12">
                            <span className='small'>{t('Website')} <span className='required-field-warning'>*</span></span>
                            <Form.Item
                                name="website"
                                validateStatus={websiteValidationStatus}
                                help={websiteValidationMessage}
                                onChange={e => setWebsite(e.target.value)}
                                rules={[
                                    {
                                        required: true,
                                        message: t('Please enter the website!'),
                                    },
                                ]}
                                value={website}
                            >
                                <Input lang='en' prefix={<GlobalOutlined style={{ color: '#e6bd4f' }} />} size="large" />
                            </Form.Item>
                        </Col>

                        <Col lg="6" md="6" sm="12">
                            <span className='small'>{t('Cover Image URL')}</span>
                            <Form.Item
                                name="coverImageUrl"
                                validateStatus={coverURLValidationStatus}
                                help={coverURLValidationMessage}
                                hasFeedback
                                onChange={e => setCoverImageUrl(e.target.value)}
                            >
                                <Input
                                    lang='en'
                                    disabled={isCoverImgUploading}
                                    value={coverImageUrl}
                                    size="large"
                                    prefix={<LinkOutlined style={{ color: '#e6bd4f' }} />}
                                    placeholder="Recommended cover size: 1350x312 pixels"
                                />
                                <Upload {...uploadCoverImgConfigs} maxCount={1} listType="picture" >
                                    <Button
                                        style={{ marginTop: '10px' }}
                                        // onClick={}
                                        className='kingsale-primary-button'
                                    ><div className='d-flex'><UploadOutlined style={{ marginTop: '3px', marginRight: '4px' }} />Or Upload</div></Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>


                <Card title={t('Social Info')} className='review-info-card mt-4'>
                    <Row>
                        <Col lg="6" md="6" sm="12">
                            <span className='small'>{t('Facebook')}</span>
                            <Form.Item
                                name="facebookLink"
                                onChange={e => setFacebookLink(e.target.value)}
                                value={facebookLink}
                            >

                                <Input
                                    lang='en'
                                    prefix={<FacebookFilled style={{ color: '#e6bd4f' }} />}
                                    size="large" />
                            </Form.Item>
                        </Col>

                        <Col lg="6" md="6" sm="12">
                            <span className='small'>{t('Twitter')}</span>
                            <Form.Item
                                name="twitterLink"
                                onChange={e => setTwitterLink(e.target.value)}
                                value={twitterLink}
                            >
                                <Input lang='en' prefix={<TwitterOutlined style={{ color: '#e6bd4f' }} />} size="large" />
                            </Form.Item>
                        </Col>

                        <Col lg="6" md="6" sm="12">
                            <span className='small'>{t('Github')}</span>
                            <Form.Item
                                name="githubLink"
                                onChange={e => setGithubLink(e.target.value)}
                                value={githubLink}
                            >
                                <Input lang='en' prefix={<GithubOutlined style={{ color: '#e6bd4f' }} />} size="large" />
                            </Form.Item>
                        </Col>

                        <Col lg="6" md="6" sm="12">
                            <span className='small'>{t('Telegram')}</span>
                            <Form.Item
                                name="telegramLink"
                                onChange={e => setTelegramLink(e.target.value)}
                                value={telegramLink}
                            >
                                <Input
                                    lang='en'
                                    prefix={<img src={telegram}
                                        style={{ width: '16px' }}
                                        alt="telegram logo" />}
                                    size="large"
                                />
                            </Form.Item>
                        </Col>

                        <Col lg="6" md="6" sm="12">
                            <span className='small'>{t('Instagram')}</span>
                            <Form.Item
                                name="instagramLink"
                                onChange={e => setInstagramLink(e.target.value)}
                                value={instagramLink}
                            >
                                <Input lang='en' prefix={<InstagramFilled style={{ color: '#e6bd4f' }} />} size="large" />
                            </Form.Item>
                        </Col>

                        <Col lg="6" md="6" sm="12">
                            <span className='small'>{t('Discord')}</span>
                            <Form.Item
                                name="discordLink"
                                onChange={e => setDiscordLink(e.target.value)}
                                value={discordLink}
                            >
                                <Input
                                    lang='en'
                                    prefix={<img src={discord}
                                        style={{ width: '18px' }}
                                        alt="discord logo" />}
                                    size="large"
                                />
                            </Form.Item>
                        </Col>

                        <Col lg="6" md="6" sm="12">
                            <span className='small'>{t('Reddit')}</span>
                            <Form.Item
                                name="redditLink"
                                onChange={e => setRedditLink(e.target.value)}
                                value={redditLink}
                            >
                                <Input lang='en' prefix={<RedditOutlined style={{ color: '#e6bd4f' }} />} size="large" />
                            </Form.Item>
                        </Col>

                        <Col lg="6" md="6" sm="12">
                            <span className='small'>{t('Youtube Video Link')}</span>
                            <Form.Item
                                name="youtubeLink"
                                validateStatus={youtubeValidationStatus}
                                help={youtubeValidationMessage}
                                onChange={e => setYoutubeLink(e.target.value)}
                                value={youtubeLink}
                            >
                                <Input lang='en' prefix={<YoutubeOutlined style={{ color: '#e6bd4f' }} />} size="large" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Card title={t('Security and Analytics Info')} className='review-info-card mt-4'>
                    <Row>

                        {/* <Col lg="6" md="6" sm="12">
                            <span className='small'>{t('KYC Link')}</span>
                            <Form.Item
                                name="kycLink"
                                validateStatus={kycValidationStatus}
                                help={kycValidationMessage}
                                onChange={e => setKycLink(e.target.value)}
                                value={kycLink}
                            >
                                <Input prefix={<LinkOutlined style={{ color: '#e6bd4f' }} />} size="large" />
                            </Form.Item>
                        </Col>

                        <Col lg="6" md="6" sm="12">
                            <span className='small'>{t('Audited Link')}</span>
                            <Form.Item
                                name="auditedLink"
                                validateStatus={auditedValidationStatus}
                                help={auditedValidationMessage}
                                onChange={e => setAuditedLink(e.target.value)}
                                value={auditedLink}
                            >
                                <Input prefix={<LinkOutlined style={{ color: '#e6bd4f' }} />} size="large" />
                            </Form.Item>
                        </Col>

                        <Col lg="6" md="6" sm="12">
                            <span className='small'>{t('Safu Link')}</span>
                            <Form.Item
                                name="safuLink"
                                validateStatus={safuValidationStatus}
                                help={safuValidationMessage}
                                onChange={e => setSafuLink(e.target.value)}
                                value={safuLink}
                            >
                                <Input prefix={<LinkOutlined style={{ color: '#e6bd4f' }} />} size="large" />
                            </Form.Item>
                        </Col> */}

                        <Col lg="12" md="12" sm="12">
                            <span className='small'>{t('Poocoin Link')}</span>
                            <Form.Item
                                name="poocoinLink"
                                validateStatus={pooCoinValidationStatus}
                                help={pooCoinValidationMessage}
                                onChange={e => setPoocoinLink(e.target.value)}
                                value={poocoinLink}
                            >
                                <Input lang='en' prefix={<LinkOutlined style={{ color: '#e6bd4f' }} />} size="large" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>


                <Card title={t('Description')} className='review-info-card mt-4'>
                    <Row>
                        <Col lg="12" md="12" sm="12">
                            <Form.Item >
                                <BundledEditor
                                    onInit={(evt, editor) => editorRef.current = editor}
                                    // onChange={(e) => setDescription(editorRef.current.getContent())}
                                    onEditorChange={(e) => setDescription(editorRef.current.getContent())}
                                    value={description}
                                    init={{
                                        height: 500,
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'anchor', 'autolink', 'help', 'image', 'link', 'lists',
                                            'searchreplace', 'table', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>



                <Row>
                    <Col lg="12" md="12" sm="12" className='text-end mt-3'>
                        <Form.Item>
                            <Button onClick={() => setStepNumberParent(1)} style={{ marginRight: '5px' }}>{t('Back')}</Button>
                            <Button disabled={!canProceedToNextStep} type="primary" htmlType='submit'>{t('Next')}</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default AdditionalInfo