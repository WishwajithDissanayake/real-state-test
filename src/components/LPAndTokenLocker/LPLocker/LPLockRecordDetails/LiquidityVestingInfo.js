import React, { useState } from 'react'
import { Table, Pagination } from 'antd'
import { DateTime } from 'luxon';

function LiquidityVestingInfo(props) {

  const { Column } = Table;
  const { isLiquidityDataLoading, liquidityLockDetailsOnChain } = props
  // pagination related data
  const [currentPage, setCurrentPage] = useState(1) // current active page number
  // const [totalRecords, setTotalRecords] = useState(1) // total number of records
  const [pagesize, setPageSize] = useState(15) // records count per page
  const [vestingDetailsList, setVestingDetailsList] = useState([])

  const calculateVestingCycles = () => {
    const initialVestingPercentage = liquidityLockDetailsOnChain?.initialPercentage
    const releaseCycle = liquidityLockDetailsOnChain?.releaseCycle
    const releasePercentage = liquidityLockDetailsOnChain?.releasePercentage
    const nextClaimTimestamp = liquidityLockDetailsOnChain?.nextClaimTimestamp
    const lockedAmount = liquidityLockDetailsOnChain?.tokenLockedAmountFormatted

    const initialTokenAmountRelease = (lockedAmount / 100) * initialVestingPercentage
    const remainingTokenAmountToBeReleased = lockedAmount - initialTokenAmountRelease
    const tokenReleaseForEachCycle = (lockedAmount / 100) * releasePercentage


    let vestingCumulativeTokens = tokenReleaseForEachCycle
    let index = 1
    let daysElapsed = releaseCycle
    const initialVestingStartTime = DateTime.fromSeconds(parseInt(nextClaimTimestamp))
    const vestingList = []
    const initialPayload = {
      id: 1,
      time: initialVestingStartTime.toFormat("yyyy.LL.dd HH:mm:ss"),
      unlockTokens: initialTokenAmountRelease,
      percentage: initialVestingPercentage
    }
    vestingList.push(initialPayload)
    while (vestingCumulativeTokens <= remainingTokenAmountToBeReleased) {
      const nextVestingDay = initialVestingStartTime.plus({ days: daysElapsed })
      const payload = {
        id: index + 1,
        time: nextVestingDay.toFormat("yyyy.LL.dd HH:mm:ss"),
        unlockTokens: tokenReleaseForEachCycle,
        percentage: releasePercentage
      }
      daysElapsed += releaseCycle
      vestingCumulativeTokens += tokenReleaseForEachCycle
      index++
      vestingList.push(payload)
    }

    const actualCommutativeAmount = vestingCumulativeTokens - tokenReleaseForEachCycle
    if (remainingTokenAmountToBeReleased - actualCommutativeAmount > 0) {
      const nextVestingDay = initialVestingStartTime.plus({ days: daysElapsed + releaseCycle })
      const remainingAmount = remainingTokenAmountToBeReleased - actualCommutativeAmount
      const remainingPercentage = (remainingAmount / lockedAmount) * 100
      const payload = {
        id: index + 1,
        time: nextVestingDay.toFormat("yyyy.LL.dd HH:mm:ss"),
        unlockTokens: remainingAmount.toFixed(1),
        percentage: parseInt(remainingPercentage)
      }
      vestingList.push(payload)
    }
    setVestingDetailsList(vestingList)
  }

  useState(() => {
    if (liquidityLockDetailsOnChain) {
      calculateVestingCycles()
    }
  }, [liquidityLockDetailsOnChain])

  const onChange = (page) => {
    setCurrentPage(page);
  };

  const onChangePageSize = (current, size) => {
    setPageSize(size)
  }

  return (
    <div className='table'>
      <div className='table-responsive'>
        <Table
          loading={isLiquidityDataLoading}
          dataSource={vestingDetailsList}
          pagination={false}
        >

          <Column title="Unlock#" dataIndex="id" key="id" className='text-center' />
          <Column title="Time (UTC)" dataIndex="time" key="id" className='text-center' />
          <Column title="Unlocked tokens" key="id" className='text-center'
            render={
              (_, record) => (
                <>
                  <span>{record.unlockTokens}</span>
                  <span> ({record.percentage}%)</span>
                </>
              )
            }
          />
        </Table>

        <div className='d-flex justify-content-center mt-4'>
          <Pagination
            current={currentPage}
            pageSize={pagesize}
            pageSizeOptions={["15", "30", "60", "90"]}
            onChange={onChange}
            onShowSizeChange={onChangePageSize}
          // total={totalRecords} 
          />
        </div>
      </div>
    </div>
  )
}

export default LiquidityVestingInfo