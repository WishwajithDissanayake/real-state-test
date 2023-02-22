import React, { useState, useEffect } from 'react'
import { Col, Row } from 'reactstrap'
import PresaleWidget from '../../components/PresalesComponents/PresaleWidget'
import { Pagination, Spin, Alert } from 'antd'
import './Presales.css'
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'react-feather'
import { useSelector } from 'react-redux'
import { useWeb3React } from '@web3-react/core'

function LikedPresales() {

  const { t } = useTranslation();
  const PAGE_LIMIT = 9
  const [isPoolDataLoading, setIsPoolDataLoading] = useState(false)
  const [poolDataList, setPoolDataList] = useState([])
  const [totalPools, setTotalPools] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const { likedPresales, likedPresalesLength } = useSelector((state) => state.likedPresales)
  const { account } = useWeb3React()

  const fetchActivePools = async () => {
    setIsPoolDataLoading(true)

    setPoolDataList(likedPresales)
    setTotalPools(likedPresalesLength)

    setIsPoolDataLoading(false)

  }

  const onChange = (pageNumber) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber)
    }
  }

  useEffect(() => {
    fetchActivePools()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, likedPresalesLength])

  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a><ChevronLeft className='pagination-arrows' /></a>;
    }
    if (type === 'next') {
      return <a><ChevronRight className='pagination-arrows' /></a>;
    }
    return originalElement;
};


  return (
    <div className='mt-5 mb-5 mx-auto'>
      <Row>
          {/* {
            isPoolDataLoading ? (
              <Col lg="12" md="12" sm="12">
                <div className='d-flex justify-content-center'>
                  <Spin size='medium' />
                </div>
              </Col>
            ) : (
              <>
                {
                  likedPresalesLength >0 ? (
                    <Row className='mx-auto'>
                      {
                        poolDataList.map((item, index) => (
                          
                          <Col lg="4" md="6" sm="12" key={index}>
                            <div className='mt-3'>
                              <PresaleWidget
                                data={item}
                                key={index}
                                />
                            </div>
                          </Col>
                        ))
                      }
                    </Row>
                  ) : (
                    
                    <Col lg="12" md="12" sm="12">
                      <Alert
                        message={t("Please connect your wallet")}
                        description={t("Connect your wallet to fetch the presale you have liked.")}
                        type="warning"
                        showIcon
                      />
                    </Col>
                  )
                }
              </>
              
            )
          } */}
          {
          account ? (
            isPoolDataLoading ? (
              <Col lg="12" md="12" sm="12">
                <div className='d-flex justify-content-center'>
                  <Spin size='medium' />
                </div>
              </Col>
            ) : (
              <>
                {
                  likedPresalesLength > 0 ? (
                    <Row className='mx-auto'>
                      {
                        poolDataList?.map((item, index) => (
                          <Col lg="4" md="6" sm="12" key={index}>
                            <div className='mt-3'>
                              <PresaleWidget
                                data={item}
                                key={index} />
                            </div>
                          </Col>
                        ))
                      }
                    </Row>
                  ) : (
                    <div className='d-flex justify-content-center'>
                      <span>{t('No pools found')}</span>
                    </div>
                  )
                }
              </>

            )

          ) : (
            <Col lg="12" md="12" sm="12">
              <Alert
                message={t("Please connect your wallet")}
                description={t("Connect your wallet to fetch the presale you have liked.")}
                type="warning"
                showIcon
              />
            </Col>
          )
        }
      </Row>

      <Row>
        <Col lg="12" md="12" sm="12">
          <div className="d-flex justify-content-center my-5">
            <Pagination
              total={totalPools}
              defaultPageSize={PAGE_LIMIT}
              current={currentPage}
              onChange={onChange}
              itemRender={itemRender}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default LikedPresales