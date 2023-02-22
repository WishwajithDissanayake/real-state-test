import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'antd'
import { Row, Col } from 'reactstrap'
import { useSelector, useDispatch } from "react-redux";
import { close_blockchain_modal } from '../../Redux/BlockChainChange';
import { useTranslation } from 'react-i18next'
// blockchain logos
// import avalanche from '../../images/blockchains/avalanche.png'
import binance from '../../images/blockchains/binance.png'
// import cronos from '../../images/blockchains/cronos.png'
// import dogechain from '../../images/blockchains/dogechain.png'
// import etherum from '../../images/blockchains/etherum.png'
// import fantom from '../../images/blockchains/fantom.png'
// import matic from '../../images/blockchains/matic.png'

function ChangeBlockChain() {

    const dispatch = useDispatch()
    const { t } = useTranslation()
    const { blockchain_modal_opened } = useSelector((state) => state.blockchainModalState)
    const [currentNetworkID, setCurrentNetworkID] = useState(0)

    const handleOk = () => {
        dispatch(close_blockchain_modal())
    }

    const handleCancel = () => {
        dispatch(close_blockchain_modal())
    }

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('chainChanged', event => {
                const chainID = parseInt(event.toString(), 16)
                setCurrentNetworkID(chainID)
            });

            window.ethereum.request({ method: "eth_chainId" })
                .then(chainId => {
                    setCurrentNetworkID(parseInt(chainId, 16))
                })

        }
    }, [])

    const handleNetworkChange = async (networkId) => {
        const chainId = `0x${Number(networkId).toString(16)}`
        const provider = window.ethereum
        try {
            if (provider) {
                await provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: chainId }],
                })
            }
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                console.log("This network is not available in your metamask, please add it")
            }
            console.log("Failed to switch to the network")
        }
    }

    return (
        <Modal title={t('Select Blockchain')} visible={blockchain_modal_opened} onOk={handleOk} onCancel={handleCancel} footer={null}>
            <Row>
                {/* <Col xxl="6" xl="6" lg="6" md="6" sm="6" xs="6" className='mt-2'>
                    <Button className='text-center h-100 w-100'>
                        <img src={etherum} alt="ethereum" style={{width: '40px'}} />
                        <h6 className='mt-2 primary-text small'>Ethereum</h6>
                    </Button>
                </Col> */}

                <Col xxl="6" xl="6" lg="6" md="6" sm="6" xs="6" className='mt-2' >
                    <Button
                        onClick={() => handleNetworkChange(56)}
                        className={`text-center h-100 w-100 ${currentNetworkID === 56 ? 'selected-network' : ''}`}>
                        <img src={binance} alt="binance" style={{ width: '40px' }} />
                        <h6 className='mt-2 primary-text small'>BSC Mainnet</h6>
                    </Button>
                </Col>

                <Col xxl="6" xl="6" lg="6" md="6" sm="6" xs="6" className='mt-2'>
                    <Button
                        onClick={() => handleNetworkChange(97)}
                        className={`text-center h-100 w-100 ${currentNetworkID === 97 ? 'selected-network' : ''}`}>
                        <img src={binance} alt="binance" style={{ width: '40px' }} />
                        <h6 className='mt-2 primary-text small'>BSC Testnet</h6>
                    </Button>
                </Col>

                {/* <Col xxl="6" xl="6" lg="6" md="6" sm="6" xs="6" className='mt-2'>
                    <Button className='text-center h-100 w-100'>
                        <img src={matic} alt="matic-polygon" style={{width: '40px'}} />
                        <h6 className='mt-2 primary-text small'>Matic(Polygon)</h6>
                    </Button>
                </Col>

                <Col xxl="6" xl="6" lg="6" md="6" sm="6" xs="6" className='mt-2'>
                    <Button className='text-center h-100 w-100'>
                        <img src={avalanche} alt="avalanche" style={{width: '40px'}} />
                        <h6 className='mt-2 primary-text small'>Avalanche</h6>
                    </Button>
                </Col>

                <Col xxl="6" xl="6" lg="6" md="6" sm="6" xs="6" className='mt-2'>
                    <Button className='text-center h-100 w-100'>
                        <img src={fantom} alt="fantom" style={{width: '40px'}} />
                        <h6 className='mt-2 primary-text small'>Fantom Opera</h6>
                    </Button>
                </Col>

                <Col xxl="6" xl="6" lg="6" md="6" sm="6" xs="6" className='mt-2'>
                    <Button className='text-center h-100 w-100'>
                        <img src={cronos} alt="cronos" style={{width: '40px'}} />
                        <h6 className='mt-2 primary-text small'>Cronos</h6>
                    </Button>
                </Col>

                <Col xxl="6" xl="6" lg="6" md="6" sm="6" xs="6" className='mt-2'>
                    <Button className='text-center h-100 w-100'>
                        <img src={dogechain} alt="dogechain" style={{width: '40px'}} />
                        <h6 className='mt-2 primary-text small'>DogeChain</h6>
                    </Button>
                </Col> */}
            </Row>

            {/* <Row className='mt-3'>
                <span className='text-uppercase'>Testnet</span>

                <Col xxl="6" xl="6" lg="6" md="6" sm="6" xs="6" className='mt-2'>
                    <Button className='text-center h-100 w-100'>
                        <img src={binance} alt="binance" style={{ width: '40px' }} />
                        <h6 className='mt-2 primary-text small'>BNB Smart Chain</h6>
                    </Button>
                </Col>

                <Col xxl="6" xl="6" lg="6" md="6" sm="6" xs="6" className='mt-2'>
                    <Button className='text-center h-100 w-100'>
                        <img src={matic} alt="matic-polygon" style={{ width: '40px' }} />
                        <h6 className='mt-2 primary-text small'>Matic Mumbai</h6>
                    </Button>
                </Col>
            </Row> */}
        </Modal>
    )
}

export default ChangeBlockChain