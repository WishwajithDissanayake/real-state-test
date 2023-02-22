import React, { useEffect, useState } from 'react'
import { Col, Row } from 'reactstrap'
import PresaleWidget from '../../components/PresalesComponents/PresaleWidget'
import { useWeb3React } from '@web3-react/core'
import { Alert, Pagination, Spin } from 'antd'
import axios from 'axios'
import './Presales.css'
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'react-feather'

function MyPresales() {

  const { t } = useTranslation();
  const PAGE_LIMIT = 9
  const [isUserPoolsLoading, setIsUserPoolsLoading] = useState(false)
  const [userPools, setUserPools] = useState([])
  const [totalPools, setTotalPools] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const { account } = useWeb3React()

  const fetchAllUserPools = async () => {
    setIsUserPoolsLoading(true)
    try {
      if (account) {
        const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/v1/presale/get-presale/${account}?page=${currentPage}&limit=${PAGE_LIMIT}`
        const response = await axios.get(endpoint)
        if (response.status === 200) {
          const payload = response.data.payload
          if (payload) {
            const total = payload.meta.totalItems
            setTotalPools(total)
            setUserPools(payload.items)
          } else {
            setUserPools([])
          }
          setIsUserPoolsLoading(false)
        }
      } else {
        setUserPools([])
        setIsUserPoolsLoading(false)
      }
    } catch (error) {
      setIsUserPoolsLoading(false)
      console.log("ERROR while fetching user pools from API ", error)
    }
  }

  const onChange = (pageNumber) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber)
    }
  }

  useEffect(() => {
    fetchAllUserPools()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, currentPage])

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
        {
          account ? (
            isUserPoolsLoading ? (
              <Col lg="12" md="12" sm="12">
                <div className='d-flex justify-content-center'>
                  <Spin size='medium' />
                </div>
              </Col>
            ) : (
              <>
                {
                  totalPools > 0 ? (
                    <Row className='mx-auto'>
                      {
                        userPools.map((item, index) => (
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
                description={t("Connect your wallet to fetch the presale you have created.")}
                type="warning"
                showIcon
              />
            </Col>
          )
        }

      </Row>

      <Row className='mx-auto'>
        <Col lg="12" md="12" sm="12">
          <div className="d-flex justify-content-center my-5">
            <Pagination
              total={totalPools}
              defaultPageSize={10}
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

export default MyPresales