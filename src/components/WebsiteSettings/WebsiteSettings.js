import React, { useEffect } from 'react'
import { Sun, Moon } from 'react-feather'
import { useThemeSwitcher } from "react-css-theme-switcher";
import { useDispatch, useSelector } from 'react-redux';
import { lightTheme, darkTheme } from '../../Redux/ThemeState';
import kingshiba from '../../images/kingshiba.png'
import { useTranslation } from 'react-i18next';
import { Switch } from 'antd';
// import { Select } from 'antd';
// import { changeLang } from '../../Redux/Language';

function WebsiteSettings() {

    // const { Option } = Select;
    const dispatch = useDispatch()
    const { switcher, currentTheme, themes } = useThemeSwitcher();
    const { margin } = useSelector((state) => state.margin);
    const { i18n } = useTranslation();
    const { lang } = useSelector((state) => state.languageState)

    // const handleChange = (value) => {
    //     dispatch(changeLang(value))
    // };

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang, i18n])


    const handleLightTheme = () => {
        switcher({ theme: themes.light })
        dispatch(lightTheme())
    }

    const handleDarkTheme = () => {
        switcher({ theme: themes.dark })
        dispatch(darkTheme())
    }

    const toggleTheme = () => {
        if (currentTheme === 'dark') {
            handleLightTheme()
        } else {
            handleDarkTheme()
        }
    }

    return (
        <div className='p-3'>
            {/* {
                margin &&
                <div className='d-flex justify-content-between'>
                    <div>
                        <img src={kingshiba} alt="kingshiba_logo" style={{ width: '20px', marginTop: '-5px', marginLeft: '5px' }} /> <span className='fw-bold primary-text'>King Shiba</span>
                    </div>

                    <div className='fw-bold'>
                        ~ testnet
                    </div>
                </div>
            } */}

            <div className='d-flex justify-content-between mt-2'>
                {/* {margin &&
                    <div className='col-8'>
                        <Select
                            size='small'
                            bordered={false}
                            showArrow={false}
                            placement="topLeft"
                            style={{
                                width: '100%',
                            }}
                            placeholder="select one country"
                            value={lang}
                            onChange={handleChange}
                            optionLabelProp="label"
                        >
                            <Option value="ch" label={<span className='fw-bold'>🇨🇳 China</span>}>
                                <div className="demo-option-label-item">
                                    <span role="img" aria-label="China">
                                        🇨🇳
                                    </span>
                                    China (中国)
                                </div>
                            </Option>
                            <Option value="en" label={<span className='fw-bold'>🇺🇸 USA</span>}>
                                <div className="demo-option-label-item">
                                    <span role="img" aria-label="USA">
                                        🇺🇸
                                    </span>
                                    USA (EN)
                                </div>
                            </Option>
                        </Select>
                    </div>
                } */}

                <div style={{ marginLeft: '5px' }} className='d-flex'>
                    <Switch
                        checkedChildren={<Moon size={16} style={{ cursor: 'pointer', marginTop: '-3px' }} />}
                        unCheckedChildren={<Sun size={16} style={{ cursor: 'pointer', marginTop: '-3px' }} />}
                        checked={currentTheme === 'dark'}
                        onChange={toggleTheme}
                    />
                    {/* <Sun size={18} style={{ cursor: 'pointer' }} color={currentTheme === 'light' ? '#e6bd4f' : '#fff'} onClick={() => handleLightTheme()} /> / <Moon size={18} style={{ cursor: 'pointer' }} color={currentTheme === 'dark' ? '#e6bd4f' : '#000'} onClick={() => handleDarkTheme()} /> */}
                </div>
            </div>
        </div>
    )
}

export default WebsiteSettings