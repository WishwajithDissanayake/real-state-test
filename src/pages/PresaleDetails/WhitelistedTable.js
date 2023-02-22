import React, { useState } from 'react'
import useWhitelistedAddresses from '../../Hooks/useWhitelistedAddresses'
import { Table, Tooltip } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

function WhitelistedTable(props) {

    const { poolAddress, refreshWhitelist, setRefreshWhitelist } = props
    const { Column } = Table;
    const [copyState, setCopyState] = useState('Copy')

    const {
        isLoading,
        whitelistedAdd
    } = useWhitelistedAddresses({ poolAddress: poolAddress, refreshWhitelist: refreshWhitelist, setRefreshWhitelist: setRefreshWhitelist })

    const handleCopy = (value) => {
        setCopyState('Copied')
        navigator.clipboard.writeText(value)

        setTimeout(function () {
            setCopyState('Copy')
        }, 1000);
    }

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
    })
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        })
    }

    return (
        <div className='table table-responsive mt-4'>
            <Table
                size='small'
                loading={isLoading}
                dataSource={whitelistedAdd}
                onChange={handleTableChange}
                pagination={tableParams.pagination}
                paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
            >
                <Column title="No." render={(text, record, index) => <span className='small'>{index + 1}</span>} />
                <Column title="Address" render={(text, record) => <span className='small'>{record}</span>} />
                <Column title="Copy" render={(text, record) => <span style={{ cursor: 'pointer' }}><Tooltip title={copyState}><CopyOutlined onClick={() => handleCopy(record)} /></Tooltip></span>} />
            </Table>
        </div>
    )
}

export default WhitelistedTable