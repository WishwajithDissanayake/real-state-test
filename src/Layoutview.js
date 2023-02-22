import { Layout, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import SiderComponent from './components/Sider/SiderComponent';
import FooterComponent from './components/Footer/FooterComponent';
import Pages from './pages/Pages';
import Header from './components/Header/HeaderComponent';
import TrendingList from './components/Header/TrendingList';
import { useSelector } from "react-redux";
import WebsiteSettings from './components/WebsiteSettings/WebsiteSettings';

function Layoutview() {

  const { Content } = Layout
  const { margin } = useSelector((state) => state.margin)
  const [marginVariable, setMarginVariable] = useState('side-menu-margin-extended')
  const [width, setWidth] = useState('width-240')
  const [contentWidth, setContentWidth] = useState('container')
  const [isPreloaderActive, setIsPreloaderActive] = useState(true)


  useEffect(() => {
    const changePreloaderState = () => {
      setIsPreloaderActive(false)
    }

    setTimeout(() => {
      changePreloaderState()
    }, 500)
  }, [])
  

  useEffect(() => {
    if (margin) {
      setMarginVariable('side-menu-margin-extended')
      setWidth('width-240')
      setContentWidth('container')
    } else {
      setMarginVariable('side-menu-margin')
      setWidth('width-80')
      setContentWidth('col-lg-10')
    }
  }, [margin])

  return (
    // main layout of the website
    <Spin spinning={isPreloaderActive} tip="Loading..." className='site-preloader'>
      <Layout>
        {/* header */}
        <Header className="header" />

        {/* <TrendingList width={width} /> */}

        <Layout>
          {/* side menu */}
          <div className='side-menu'>
            <Layout>
              <SiderComponent />

              <div className={`website-settings ${width}`}>
                <WebsiteSettings />
              </div>
            </Layout>
          </div>

          {/* dynamic content + footer */}
          <Layout className={marginVariable}>
            <Content className='content'>

              <TrendingList width={width} />

              <div className={`mt-5 mx-auto ${contentWidth} content-margin`}>
                <div>
                  <Pages />
                </div>
              </div>
            </Content>

            <FooterComponent />
          </Layout>
        </Layout>
      </Layout>
    </Spin>
  )
}

export default Layoutview
