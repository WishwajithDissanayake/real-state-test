import React, { useRef, useEffect, useState } from 'react'
import {
    Button,
    Form,
    Input,
    Upload,
    Checkbox,
    DatePicker,
    Select,
    Alert,
    Card,
    notification,
} from 'antd'
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
import { Row, Col } from 'reactstrap'
import './Launchpad.css'
import discord from '../../images/discord.png'
import telegram from '../../images/telegram.png'
import BundledEditor from '../../helpers/BundledEditor'

function PresaleInfomation(props) {

    const {
        setStepNumberParent,
        realStateName,
        setRealStateName,
        realStateLocation,
        setRealStateLocation,
        realStateWebsite,
        setRealStateWebsite,
        realStateImageUrl,
        setRealStateImageUrl,
        realStateCoverImageUrl,
        setRealStateCoverImageUrl,
        realStateOtherImageUrl,
        setRealStateOtherImageUrl,
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
        youtubeLink,
        setYoutubeLink,
        description,
        setDescription,
        setIsNextButtonActive,
        isNextButtonActive,

    } = props


    const [websiteValidationMessage, setWebsiteValidationMessage] = useState(null)
    const [websiteValidationStatus, setWebsiteValidationStatus] = useState(null)

    const editorRef = useRef(null)
    const [imageURLValidationMessage, setImageURLValidationMessage] = useState(null)
    const [imageURLValidationStatus, setImageURLValidationStatus] = useState(null)

    const [canProceedToNextStep, setCanProceedToNextStep] = useState(false)

    const [coverURLValidationMessage, setCoverURLValidationMessage] = useState(null)
    const [coverURLValidationStatus, setCoverURLValidationStatus] = useState(null)

    const [otherImageURLValidationStatus, setOtherImageURLValidationStatus] = useState(null)
    const [otherImageURLValidationMessage, setOtherImageURLValidationMessage] = useState(null)
    const key = 'updatable';

    const [youtubeValidationMessage, setYoutubeValidationMessage] = useState(null)
    const [youtubeValidationStatus, setYoutubeValidationStatus] = useState(null)

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

    const onFinish = (values) => {
        setStepNumberParent(1)
        console.log(values, 'presale information')
    }

    useEffect(() => {
        if (realStateWebsite) {
            if (isValidUrl(realStateWebsite)) {
                setWebsiteValidationStatus('success')
                setWebsiteValidationMessage(null)
                setCanProceedToNextStep(true)
            } else {
                setWebsiteValidationStatus('error')
                setWebsiteValidationMessage(("Invalid website url"))
                setCanProceedToNextStep(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [realStateWebsite])

    useEffect(() => {
        if (realStateImageUrl) {
            if (isValidImageURL(realStateImageUrl)) {
                setImageURLValidationStatus('success')
                setImageURLValidationMessage(null)
                setCanProceedToNextStep(true)
            } else {
                setImageURLValidationStatus('error')
                setImageURLValidationMessage(("Invalid logo URL. Enter the direct URL to the logo in .png, .jpg or .gif format"))
                setCanProceedToNextStep(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [realStateImageUrl])

    useEffect(() => {
        if (realStateCoverImageUrl) {
            if (isValidImageURL(realStateCoverImageUrl)) {
                setCoverURLValidationStatus('success')
                setCoverURLValidationMessage(null)
                setCanProceedToNextStep(true)
            } else {
                setCoverURLValidationStatus('error')
                setCoverURLValidationMessage(("Invalid logo URL. Enter the direct URL to the logo in .png, .jpg or .gif format"))
                setCanProceedToNextStep(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [realStateCoverImageUrl])

    useEffect(() => {
        if (realStateOtherImageUrl) {
            if (isValidImageURL(realStateOtherImageUrl)) {
                setOtherImageURLValidationStatus('success')
                setOtherImageURLValidationMessage(null)
                setCanProceedToNextStep(true)
            } else {
                setOtherImageURLValidationStatus('error')
                setOtherImageURLValidationMessage(("Invalid logo URL. Enter the direct URL to the logo in .png, .jpg or .gif format"))
                setCanProceedToNextStep(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [realStateOtherImageUrl])

    useEffect(() => {
        if (youtubeLink) {
            if (isValidYoutubeUrl(youtubeLink)) {
                setYoutubeValidationStatus('success')
                setYoutubeValidationMessage(null)
                setCanProceedToNextStep(true)
            } else {
                setYoutubeValidationStatus('error')
                setYoutubeValidationMessage(("Invalid video url"))
                setCanProceedToNextStep(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [youtubeLink])

    const uploadConfigs = {
        // onRemove: () => {
        //     setUploadedLogoFile(null)
        //     setLogoURL(null)
        // },
        // beforeUpload: (file) => {
        //     const isPNG = file.type === 'image/png'
        //     const isJPG = file.type === 'image/jpg'
        //     const isJPEG = file.type === 'image/jpeg'
        //     const isGIF = file.type === 'image/gif'

        //     if (isPNG || isJPG || isJPEG || isGIF) {
        //         let fileSize = file.size / 1024 / 1024; // in MiB
        //         console.log(fileSize)
        //         if (fileSize <= 5) {
        //             setUploadedLogoFile(file)
        // } else {
        //     setUploadedLogoFile(null)
        //     setLogoURL(null)
        //     setLogoURLValidationStatus('error')
        //     notification['error']({
        //         key,
        //         message: ('Invalid File Size'),
        //         description:
        //             ('Please select a file less than 5MB'),
        //     })
        // }
        // } else {
        // notification['error']({
        //     key,
        //     message: ('Invalid File Type'),
        //     description:
        //         ('Please upload .png, .jpg, .jpeg or .gif formats'),
        // })
        //             return false
        //         }
        //         return false
        //     },
    }

    useEffect(() => {
        if (realStateName && description) {
            setIsNextButtonActive(true)
        } else {
            setIsNextButtonActive(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [realStateName, description])

    return (
        <div>
            <div className='mb-2'>
                <span className='text-validation-error'>(*) {('is required field.')}</span>
            </div>
            <Form
                name="presale_info"
                onFinish={onFinish}
            >
                <Row>
                    <Col lg="6" md="6" sm="12">
                        <span className='small'>{('Real State Name')} <span className='required-field-warning'>*</span></span>
                        <Form.Item
                            name="realStateName"
                            value={realStateName}
                            onChange={e => setRealStateName(e.target.value)}
                            rules={[
                                {
                                    required: true,
                                    message: ('Please enter the real state name!'),
                                },
                            ]}
                        >
                            <Input
                                lang='en'
                                size='large'
                                placeholder={('Enter the real state name')} />
                        </Form.Item>
                    </Col>

                    <Col lg="6" md="6" sm="12">
                        <span className='small'>{('Location (address, city)')} <span className='required-field-warning'>*</span></span>
                        <Form.Item
                            name="realStateLocation"
                            value={realStateLocation}
                            onChange={e => setRealStateLocation(e.target.value)}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: (`Please enter real state location`),
                                }
                            ]}
                        >
                            <Input
                                lang='en'
                                size='large'
                                placeholder={('Enter the real state location')} />
                        </Form.Item>
                    </Col>
                    <Col lg="6" md="6" sm="12">
                        <span className='small'>{('Real State Image')} <span className='required-field-warning'>*</span></span>
                        <Form.Item
                            name="realStateImageUrl"
                            validateStatus={imageURLValidationStatus}
                            help={imageURLValidationMessage}
                            hasFeedback
                            onChange={e => setRealStateImageUrl(e.target.value)}
                        >
                            <Input
                                lang='en'
                                // disabled={isLogoUploading}
                                value={realStateImageUrl}
                                size="large"
                                prefix={<LinkOutlined style={{ color: '#e6bd4f' }} />}
                                placeholder="Recommended image size: 1200x800 pixels"
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
                        <span className='small'>{('Website')} <span className='required-field-warning'>*</span></span>
                        <Form.Item
                            name="realStateWebsite"
                            value={realStateWebsite}
                            validateStatus={websiteValidationStatus}
                            help={websiteValidationMessage}
                            onChange={e => setRealStateWebsite(e.target.value)}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: (`Please enter real state website`),
                                }
                            ]}
                        >
                            <Input
                                lang='en'
                                size='large'
                                placeholder={('Enter the real state website')} />
                        </Form.Item>
                    </Col>
                    <Col lg="6" md="6" sm="12">
                        <span className='small'>{('Real State Cover Image')} <span className='required-field-warning'>*</span></span>
                        <Form.Item
                            name="realStateCoverImageUrl"
                            validateStatus={coverURLValidationStatus}
                            help={coverURLValidationMessage}
                            hasFeedback
                            onChange={e => setRealStateCoverImageUrl(e.target.value)}
                        >
                            <Input
                                lang='en'
                                // disabled={isLogoUploading}
                                value={realStateCoverImageUrl}
                                size="large"
                                prefix={<LinkOutlined style={{ color: '#e6bd4f' }} />}
                                placeholder="Recommended image size: 1200x800 pixels"
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
                        <span className='small'>{('Real State Other Image/Images')}</span>
                        <Form.Item
                            name="realStateOtherImageUrl"
                            validateStatus={otherImageURLValidationStatus}
                            help={otherImageURLValidationMessage}
                            hasFeedback
                            onChange={e => setRealStateOtherImageUrl(e.target.value)}
                        >
                            <Input
                                lang='en'
                                // disabled={isLogoUploading}
                                value={realStateOtherImageUrl}
                                size="large"
                                prefix={<LinkOutlined style={{ color: '#e6bd4f' }} />}
                                placeholder="Recommended image size: 1200x800 pixels"
                            />
                            <Upload {...uploadConfigs} maxCount={5} listType="picture" >
                                <Button
                                    style={{ marginTop: '10px' }}
                                    // onClick={}
                                    className='kingsale-primary-button'
                                ><div className='d-flex'><UploadOutlined style={{ marginTop: '3px', marginRight: '4px' }} />Or Upload</div></Button>
                            </Upload>
                        </Form.Item>
                    </Col>


                    {/* // */}

                </Row>

                <Card title={('Social Info')} className='review-info-card mt-4'>
                    <Row>
                        <Col lg="6" md="6" sm="12">
                            <span className='small'>{('Facebook')}</span>
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
                            <span className='small'>{('Twitter')}</span>
                            <Form.Item
                                name="twitterLink"
                                onChange={e => setTwitterLink(e.target.value)}
                                value={twitterLink}
                            >
                                <Input lang='en' prefix={<TwitterOutlined style={{ color: '#e6bd4f' }} />} size="large" />
                            </Form.Item>
                        </Col>

                        <Col lg="6" md="6" sm="12">
                            <span className='small'>{('Github')}</span>
                            <Form.Item
                                name="githubLink"
                                onChange={e => setGithubLink(e.target.value)}
                                value={githubLink}
                            >
                                <Input lang='en' prefix={<GithubOutlined style={{ color: '#e6bd4f' }} />} size="large" />
                            </Form.Item>
                        </Col>

                        <Col lg="6" md="6" sm="12">
                            <span className='small'>{('Telegram')}</span>
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
                            <span className='small'>{('Instagram')}</span>
                            <Form.Item
                                name="instagramLink"
                                onChange={e => setInstagramLink(e.target.value)}
                                value={instagramLink}
                            >
                                <Input lang='en' prefix={<InstagramFilled style={{ color: '#e6bd4f' }} />} size="large" />
                            </Form.Item>
                        </Col>

                        <Col lg="6" md="6" sm="12">
                            <span className='small'>{('Discord')}</span>
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
                            <span className='small'>{('Reddit')}</span>
                            <Form.Item
                                name="redditLink"
                                onChange={e => setRedditLink(e.target.value)}
                                value={redditLink}
                            >
                                <Input lang='en' prefix={<RedditOutlined style={{ color: '#e6bd4f' }} />} size="large" />
                            </Form.Item>
                        </Col>

                        <Col lg="6" md="6" sm="12">
                            <span className='small'>{('Youtube Video Link')}</span>
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
                <Card title={('Description')} className='review-info-card mt-4'>
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
                <Col lg="12" md="12" sm="12" className='text-end mt-2'>
                    <Form.Item>
                        <Button type="primary"
                            // onClick={() => setStepNumberParent(1)}
                            disabled={!canProceedToNextStep} onClick={() => setStepNumberParent(1)}
                        // disabled={!isNextButtonActive} onClick={() => setStepNumberParent(1)}
                        >
                            Next</Button>
                    </Form.Item>
                </Col>

            </Form>
        </div>
    );
}

export default PresaleInfomation;