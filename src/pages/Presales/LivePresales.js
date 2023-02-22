import React, { useState, useEffect } from 'react'
import { Col, Row } from 'reactstrap'
import PresaleWidget from '../../components/PresalesComponents/PresaleWidget'
import { Pagination, Spin } from 'antd'
import axios from 'axios'
import './Presales.css'
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'react-feather'

function LivePresales() {

  const { t } = useTranslation();
  const PAGE_LIMIT = 9
  const [isPoolDataLoading, setIsPoolDataLoading] = useState(false)
  const [poolDataList, setPoolDataList] = useState([])
  const [totalPools, setTotalPools] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchActivePools = async () => {
    setIsPoolDataLoading(true)
    try {
      const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/v1/presale/all?page=${currentPage}&limit=${PAGE_LIMIT}&status=live&search`
      const response = await axios.get(endpoint)
      if (response.status === 200) {
        const payload = response.data.payload
        if (payload) {
          const total = payload.meta.totalItems
          setTotalPools(total)
          setPoolDataList(payload.items)
        } else {
          setPoolDataList([])
        }
        setIsPoolDataLoading(false)
      }
    } catch (error) {
      setIsPoolDataLoading(false)
      console.log("ERROR while fetching active pools from API ", error)
    }
  }

  const onChange = (pageNumber) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber)
    }
  }

  useEffect(() => {
    fetchActivePools()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

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
    <div className='mt-5 mb-5 presale-padding col-lg-11 mx-auto'>
      <Row>

        <div className='mt-3'>
          {
            isPoolDataLoading ? (
              <Col lg="12" md="12" sm="12">
                <div className='d-flex justify-content-center'>
                  <Spin size='medium' />
                </div>
              </Col>
            ) : (
              <>
                {
                  totalPools>0 ? (
                    <Row>
                      {
                        poolDataList.map((item, index) => (
                          
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
          }
        </div>

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

export default LivePresales