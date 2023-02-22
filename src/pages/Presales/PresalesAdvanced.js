import React, { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Input,
  Space,
  Progress,
  Tooltip
} from 'antd'
import Highlighter from 'react-highlight-words'
import { Link } from 'react-router-dom'
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'
import kingsfund from '../../images/kingsfund.png'
import './Presales.css'
import Social from '../PresaleDetails/Social'
import CountdownMini from '../../components/Countdown/CountdownMini'
import { useTranslation } from 'react-i18next';
import axios from 'axios'
import { utils } from 'ethers'
import ProgressBarMini from '../../components/ProgressBarComponent/ProgressBarMini'
import { ChevronLeft, ChevronRight } from 'react-feather'

function PresalesAdvanced() {

  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')


  const [isPoolDataLoading, setIsPoolDataLoading] = useState(false)
  const [poolDataList, setPoolDataList] = useState([])
  const [totalPools, setTotalPools] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')

  const PAGE_LIMIT = 20

  useEffect(() => {
    fetchActivePools()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchInput])

  const fetchActivePools = async () => {
    setIsPoolDataLoading(true)
    try {
      const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/v1/presale/all?page=${currentPage}&limit=${PAGE_LIMIT}&search=${searchInput}`
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

  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a><ChevronLeft size={18} className='pagination-arrows' /></a>;
    }
    if (type === 'next') {
      return <a><ChevronRight size={18} className='pagination-arrows' /></a>;
    }
    return originalElement;
  };


  const isKYC = (data) => {
    if (data.kycLink !== '') {
      return (
        <Tooltip title="KYC">
          <CheckCircleOutlined style={{ color: '#10b981', marginRight: '5px' }} />
        </Tooltip>
      )
    } else {
      return (
        <Tooltip title="KYC">
          <CloseCircleOutlined style={{ color: '#f5222d', marginRight: '5px' }} />
        </Tooltip>
      )
    }
  }

  const isAudited = (data) => {
    if (data.auditedLink !== '') {
      return (
        <Tooltip title="Audit">
          <CheckCircleOutlined style={{ color: '#3f81cf', marginRight: '5px' }} />
        </Tooltip>
      )
    } else {
      return (
        <Tooltip title="Audit">
          <CloseCircleOutlined style={{ color: '#f5222d', marginRight: '5px' }} />
        </Tooltip>
      )
    }
  }

  const isSAFU = (data) => {
    if (data.safuLink !== '') {
      return (
        <Tooltip title="SAFU">
          <CheckCircleOutlined style={{ color: '#df5ff8', marginRight: '5px' }} />
        </Tooltip>
      )
    } else {
      return (
        <Tooltip title="SAFU">
          <CloseCircleOutlined style={{ color: '#f5222d', marginRight: '5px' }} />
        </Tooltip>
      )
    }
  }

  const getProgressStatus = (data) => {
    switch (data.status.toLowerCase()) {
      case 'live':
        return (
          <ProgressBarMini
            poolAddress={data.poolContractAddress}
            poolDetails={data}
            status="active"
          />
        )
      case 'finalized':
        return (
          <ProgressBarMini
            poolAddress={data.poolContractAddress}
            poolDetails={data}
            status="normal"
          />
        )
      case 'filled':
        return (
          <ProgressBarMini
            poolAddress={data.poolContractAddress}
            poolDetails={data}
            status="success"
          />
        )
      case 'canceled':
        return (
          <Progress
            percent={0}
            showInfo={false}
          />
        )
      case 'ended':
        return (
          <ProgressBarMini
            poolAddress={data.poolContractAddress}
            poolDetails={data}
            status="exception"
          />
        )
      case 'upcoming':
        return (
          <div className='mini-progress-bar-container'>
            <div className='progress-info'>
              <span style={{ fontSize: '10px', fontWeight: '700' }}>
                Upcoming
              </span>
            </div>
            <div className='progress-bar-mini'>
              <Progress
                percent={0.0}
                showInfo={false}
                strokeWidth={12}
              />
            </div>
          </div>
        )
      case 'paused':
        return (
          <ProgressBarMini
            poolAddress={data.poolContractAddress}
            poolDetails={data}
            status="exception"
          />
        )
      default:
        break;
    }
  }

  // table column search functionalities
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0])
    setSearchInput(selectedKeys[0])
    setSearchedColumn(dataIndex)
  };

  const handleReset = (clearFilters, selectedKeys, confirm, dataIndex) => {
    clearFilters();
    setSearchText('');
    handleSearch(selectedKeys, confirm, dataIndex)
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          lang='en'
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters, selectedKeys, confirm, dataIndex)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => record.presaleName.toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const getPrivateSaleImage = (poolData) => {
    if (poolData && poolData.logoURL) {
      return poolData.logoURL
    } else {
      return kingsfund
    }
  }

  const onPageChange = (pageNumber) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber)
    }
  }

  // table columns with advanced filter, sort options
  const columns = [
    {
      title: t('Name'),
      dataIndex: 'name',
      ...getColumnSearchProps('name'),
      render: (text, record) => (<><div className='d-flex'><img src={getPrivateSaleImage(record)} alt="kingsfund" className='presale-advanced-image' style={{ width: '20px', height: '20px', marginRight: '10px', borderRadius: '50%' }} /><span className='text-truncate'>{record.presaleName}</span></div></>)
    },
    {
      title: t('HC'),
      dataIndex: 'HC',
      sorter: (a, b) => a.hardCap.toLowerCase().localeCompare(b.hardCap.toLowerCase()),
      render: (text, record) => (<span className='text-truncate'>{utils.formatEther(record.hardCap)} {record.liquidityTokenName}</span>)
    },
    {
      title: t('Coin'),
      dataIndex: 'coin',
      filters: [
        {
          text: 'BNB',
          value: 'BNB',
        },
        {
          text: 'BUSD',
          value: 'BUSD',
        },
        {
          text: 'USDT',
          value: 'USDT',
        },
      ],
      filterSearch: true,
      onFilter: (value, record) => record.liquidityTokenName.startsWith(value),
      render: (text, record) => (<span>{record.liquidityTokenName}</span>)
    },
    {
      title: t('Liquidity%'),
      dataIndex: 'liquidityPercentage',
      className: 'text-center',
      sorter: (a, b) => a.liquidityPercentage - b.liquidityPercentage,
      render: (text, record) => (<span>{record.liquidityPercentage}%</span>)
    },
    {
      title: t('KYC/Audit'),
      render: (text, record) => (
        <div className='text-center'>
          <span>{isKYC(record)}</span>
          <span>{isAudited(record)}</span>
          <span>{isSAFU(record)}</span>
        </div>
      )
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      width: 200,
      render: (text, record) => (
        <div className='text-center'>
          {getProgressStatus(record)}
        </div>),
      filters: [
        {
          text: 'Upcoming',
          value: 'upcoming'
        },
        {
          text: 'Live',
          value: 'ongoing'
        },
        {
          text: 'Fill',
          value: 'fill'
        }
      ],
      filterSearch: true,
      onFilter: (value, record) => record.status.startsWith(value),
    },
    {
      title: t('Links'),
      render: (text, record) => (<Social presaleDetails={record} isPresaleLoading={false} />)
    },
    {
      title: t('Countdown'),
      render: (text, record) => (<CountdownMini
        startTime={record ? record.startTimeTimestamp : null}
        endTime={record ? record.endTimeTimestamp : null}
      />),
      sorter: (a, b) => a.startTime - b.startTime,
    },
    {
      title: 'Actions',
      render: (text, record) => (<Link to={`/presale-details/${record?.poolContractAddress}`}>{t('View')}</Link>)
    }
  ]

  return (
    <div className='table-responsive'>
      <div className='table'>
        <Table
          columns={columns}
          dataSource={poolDataList}
          loading={isPoolDataLoading}
          pagination={{
            total: totalPools,
            defaultPageSize: PAGE_LIMIT,
            current: currentPage,
            onChange: onPageChange,
            position: ['bottomCenter'],
            itemRender: itemRender
          }}
          size="small" />
      </div>
    </div>
  )
}

export default PresalesAdvanced