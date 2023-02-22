import React, { useState, useEffect } from 'react'
import { Steps, Card } from 'antd'
import Disclaimer from '../../components/LPAndTokenLocker/Disclaimer';
import VerifyToken from './VerifyToken';
import ProjectInformation from './ProjectInformation';
import AdditionalInfo from './AdditionalInfo';
import AdditionalInformation from './AdditionalInformation';
import Review from './Review/Review';
import NewView from './NewView';
import PresaleInfomation from './PresaleInformation';
import {
  getERC20TokenDataByTokenAddress,
  getERC20TokenBalanceByWalletAddress
} from '../../Blockchain/services/common.service';
import { useWeb3React } from '@web3-react/core'
import './Launchpad.css'
import { useTranslation } from 'react-i18next';
import { Description } from '@ethersproject/properties';

function CreatePresale() {

  const { account } = useWeb3React()
  // const { t } = useTranslation();

  const { Step } = Steps;
  const [stepNumber, setStepNumber] = useState(0)
  const [isNextButtonActive, setIsNextButtonActive] = useState(false)

  //PresaleInformation variables
  const [realStateName, setRealStateName] = useState('')
  const [realStateLocation, setRealStateLocation] = useState('')
  const [realStateImageUrl, setRealStateImageUrl] = useState('')
  const [realStateCoverImageUrl, setRealStateCoverImageUrl] = useState('')
  const [realStateOtherImageUrl, setRealStateOtherImageUrl] = useState('')
  const [realStateWebsite, setRealStateWebsite] = useState('')
  const [facebookLink, setFacebookLink] = useState('')
  const [twitterLink, setTwitterLink] = useState('')
  const [githubLink, setGithubLink] = useState('')
  const [telegramLink, setTelegramLink] = useState('')
  const [instagramLink, setInstagramLink] = useState('')
  const [discordLink, setDiscordLink] = useState('')
  const [redditLink, setRedditLink] = useState('')
  const [youtubeLink, setYoutubeLink] = useState('')
  const [description, setDescription] = useState('')

  //AdditionalInformation variables
  const [propertyPrice, setPropertyPrice] = useState('')
  const [tokensPerUSD, setTokensPerUSD] = useState('')
  const [minimumBuy, setMinimumBuy] = useState('')
  const [maximumBuy, setMaximumBuy] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [isWhitelistingEnabled, setIsWhitelistingEnabled] = useState(false)
  const [publicSaleStartTime, setPublicSaleStartTime] = useState(null)

  // verifyToken variables
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenValidationStatus, setTokenValidationStatus] = useState(null)
  const [tokenValidationHelperMessage, setTokenValidationHelperMessage] = useState(null)
  const [isTokenDetailsLoading, setIsTokenDetailsLoading] = useState(false)
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [userTokenBalance, setUserTokenBalance] = useState(0.00)
  const [tokenDecimals, setTokenDecimals] = useState('')
  const [totalSupply, setTotalSupply] = useState('')
  const [yourBalanceValidationStatus, setYourBalanceValidationStatus] = useState(null)
  const [yourBalanceValidationHelperMessage, setYourBalanceValidationHelperMessage] = useState(null)
  const [liquidityToken, setLiquidityToken] = useState('BNB')
  const [liquidityTokenName, setLiquidityTokenName] = useState('BNB')

  // ProjectInformation variables
  const [projectName, setProjectName] = useState('')
  const [tokensPerBNB, setTokensPerBNB] = useState('')

  const [hardCap, setHardCap] = useState('')

  const [publicStartTime, setPublicStartTime] = useState(null)
  const [softCap, setSoftCap] = useState('')
  const [isVestingEnabled, setIsVestingEnabled] = useState(false)
  const [initialTokenReleasePercentage, setInitialTokenReleasePercentage] = useState('')
  const [vestingCyclesInDays, setVestingCyclesInDays] = useState('')
  const [tokenReleasePercentageInCycle, setTokenReleasePercentageInCycle] = useState('')
  const [liquidityPercentage, setLiquidityPercentage] = useState('')
  const [liquidityUnlockTime, setLiquidityUnlockTime] = useState('')
  const [launchRate, setLaunchRate] = useState('')
  const [liquidityProvider, setLiquidityProvider] = useState(process.env.REACT_APP_PCS_ROUTER_ADDRESS)
  const [totalTokenNeeded, setTotalTokenNeeded] = useState('')

  // AdditionalInfo variables
  const [logoURL, setLogoURL] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [website, setWebsite] = useState('')

  const [kycLink, setKycLink] = useState('')
  const [auditedLink, setAuditedLink] = useState('')
  const [safuLink, setSafuLink] = useState('')
  const [poocoinLink, setPoocoinLink] = useState('')

  const [isLiquidityBurn, setIsLiquidityBurn] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  // verifyToken functions
  const fetchUserTokenBalance = async () => {
    try {

      if (account) {
        setYourBalanceValidationStatus('validating')
        setYourBalanceValidationHelperMessage(('Fetching token balance please wait'))
        const tokenBalanceResponse = await getERC20TokenBalanceByWalletAddress(tokenAddress, account)
        setUserTokenBalance(tokenBalanceResponse)
        setYourBalanceValidationStatus(null)
        setYourBalanceValidationHelperMessage(null)
      } else {
        setYourBalanceValidationHelperMessage(('Please connect your wallet to fetch the token balance'))
        setUserTokenBalance(0)
        setYourBalanceValidationStatus('error')
      }

    } catch (error) {
      setYourBalanceValidationHelperMessage(null)
      setYourBalanceValidationStatus(null)
    }
  }

  const fetchTokenDetails = async () => {
    try {
      setIsTokenDetailsLoading(true)
      setTokenValidationStatus('validating')
      setTokenValidationHelperMessage(('validating token data'))
      const tokenDataResponse = await getERC20TokenDataByTokenAddress(tokenAddress)

      setTokenValidationHelperMessage(null)
      setTokenValidationStatus('success')
      setIsTokenDetailsLoading(false)

      //set token details
      setTokenName(tokenDataResponse?.tokenName)

      const tokenTotalSupply = tokenDataResponse?.tokenTotalSupply
      const tokenDecimals = tokenDataResponse?.tokenDecimals

      const tokenTotalSupplyValue = tokenTotalSupply / 10 ** tokenDecimals

      setTotalSupply(tokenTotalSupplyValue)
      setTokenSymbol(tokenDataResponse?.tokenSymbol)
      setTokenDecimals(tokenDataResponse?.tokenDecimals)

    } catch (error) {
      setTokenValidationStatus('error')
      setTokenValidationHelperMessage(error?.message)

      //set token details
      setTokenName('')
      setTotalSupply('')
      setTokenSymbol('')
      setTokenDecimals('')
      setUserTokenBalance('')
      setIsTokenDetailsLoading(false)
    }
  }

  useEffect(() => {

    if (tokenAddress) {
      fetchUserTokenBalance()
    } else {
      setUserTokenBalance('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAddress, account])

  useEffect(() => {
    if (tokenAddress) {
      fetchTokenDetails()
    } else {
      setTokenValidationStatus(null)
      setTokenValidationHelperMessage(null)
      setTokenName('')
      setTotalSupply('')
      setTokenSymbol('')
      setTokenDecimals('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAddress])

  return (
    <div className='mb-5'>
      {/* <h2 className='text-center mt-4 mb-4 primary-text'>Launchpad</h2> */}

      <Steps current={stepNumber}>
        <Step title={("Presale Information")} description={("Enter detailed information relating to your presale.")} />
        {/* <Step title={("Verify Token")} description={("Enter the token address and connect your wallet.")} /> */}
        {/* <Step title={("Project Information")} description={("Enter detailed information relating to your presale.")} /> */}
        <Step title={("Additional Information")} description={("Provide more information to the public.")} />
        <Step title={("Review")} description={("Review your submitted information and submit.")} />
      </Steps>

      <Card className='kingsale-card-bg mt-5'>
        {
          stepNumber === 0 &&
          <PresaleInfomation
            setStepNumberParent={setStepNumber}
            realStateName={realStateName}
            setRealStateName={setRealStateName}
            realStateLocation={realStateLocation}
            setRealStateLocation={setRealStateLocation}
            realStateWebsite={realStateWebsite}
            setRealStateWebsite={setRealStateWebsite}
            realStateImageUrl={realStateImageUrl}
            setRealStateImageUrl={setRealStateImageUrl}
            realStateCoverImageUrl={realStateCoverImageUrl}
            setRealStateCoverImageUrl={setRealStateCoverImageUrl}
            realStateOtherImageUrl={realStateOtherImageUrl}
            setRealStateOtherImageUrl={setRealStateOtherImageUrl}
            facebookLink={facebookLink}
            setFacebookLink={setFacebookLink}
            twitterLink={twitterLink}
            setTwitterLink={setTwitterLink}
            githubLink={githubLink}
            setGithubLink={setGithubLink}
            telegramLink={telegramLink}
            setTelegramLink={setTelegramLink}
            instagramLink={instagramLink}
            setInstagramLink={setInstagramLink}
            discordLink={discordLink}
            setDiscordLink={setDiscordLink}
            redditLink={redditLink}
            setRedditLink={setRedditLink}
            youtubeLink={youtubeLink}
            setYoutubeLink={setYoutubeLink}
            description={description}
            setDescription={setDescription}
            isNextButtonActive={isNextButtonActive}
            setIsNextButtonActive={setIsNextButtonActive}
          />
        }
        {
          stepNumber === 1 &&
          <AdditionalInformation
            setStepNumberParent={setStepNumber}
            propertyPrice={propertyPrice}
            setPropertyPrice={setPropertyPrice}
            tokensPerUSD={tokensPerUSD}
            setTokensPerUSD={setTokensPerUSD}
            setStepNumberParent={setStepNumber}
            minimumBuy={minimumBuy}
            setMinimumBuy={setMinimumBuy}
            maximumBuy={maximumBuy}
            setMaximumBuy={setMaximumBuy}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            isWhitelistingEnabled={isWhitelistingEnabled}
            setIsWhitelistingEnabled={setIsWhitelistingEnabled}

            publicSaleStartTime={publicSaleStartTime}
            setPublicSaleStartTime={setPublicSaleStartTime}
          />
        }
        {
          stepNumber === 2 &&
          <NewView

            setStepNumberParent={setStepNumber}
            realStateName={realStateName}
            realStateLocation={realStateLocation}
            realStateWebsite={realStateWebsite}
            realStateImageUrl={realStateImageUrl}
            realStateCoverImageUrl={realStateCoverImageUrl}
            realStateOtherImageUrl={realStateOtherImageUrl}
            facebookLink={facebookLink}
            twitterLink={twitterLink}
            githubLink={githubLink}
            telegramLink={telegramLink}
            instagramLink={instagramLink}
            discordLink={discordLink}
            redditLink={redditLink}
            youtubeLink={youtubeLink}
            description={description}
            isNextButtonActive={isNextButtonActive}
            propertyPrice={propertyPrice}
            tokensPerUSD={tokensPerUSD}
            minimumBuy={minimumBuy}
            maximumBuy={maximumBuy}
            startTime={startTime}
            endTime={endTime}
            isWhitelistingEnabled={isWhitelistingEnabled}
            publicSaleStartTime={publicSaleStartTime}
          />
        }
        {
          stepNumber === 5 &&
          <VerifyToken
            setStepNumberParent={setStepNumber}
            setTokenAddress={setTokenAddress}
            tokenAddress={tokenAddress}
            tokenValidationStatus={tokenValidationStatus}
            tokenValidationHelperMessage={tokenValidationHelperMessage}
            isTokenDetailsLoading={isTokenDetailsLoading}
            tokenName={tokenName}
            tokenSymbol={tokenSymbol}
            userTokenBalance={userTokenBalance}
            tokenDecimals={tokenDecimals}
            totalSupply={totalSupply}
            liquidityToken={liquidityToken}
            setLiquidityToken={setLiquidityToken}
            yourBalanceValidationStatus={yourBalanceValidationStatus}
            yourBalanceValidationHelperMessage={yourBalanceValidationHelperMessage}

            isNextButtonActive={isNextButtonActive}
            setLiquidityTokenName={setLiquidityTokenName}
          />
        }

        {
          stepNumber === 3 &&
          <ProjectInformation
            setStepNumberParent={setStepNumber}
            projectName={projectName}
            setProjectName={setProjectName}
            tokensPerBNB={tokensPerBNB}
            setTokensPerBNB={setTokensPerBNB}

            hardCap={hardCap}
            setHardCap={setHardCap}
            softCap={softCap}
            setSoftCap={setSoftCap}



            setIsNextButtonActive={setIsNextButtonActive}

            publicStartTime={publicStartTime}
            setPublicStartTime={setPublicStartTime}
            isVestingEnabled={isVestingEnabled}
            setIsVestingEnabled={setIsVestingEnabled}
            initialTokenReleasePercentage={initialTokenReleasePercentage}
            setInitialTokenReleasePercentage={setInitialTokenReleasePercentage}
            vestingCyclesInDays={vestingCyclesInDays}
            setVestingCyclesInDays={setVestingCyclesInDays}
            tokenReleasePercentageInCycle={tokenReleasePercentageInCycle}
            setTokenReleasePercentageInCycle={setTokenReleasePercentageInCycle}
            liquidityPercentage={liquidityPercentage}
            setLiquidityPercentage={setLiquidityPercentage}
            liquidityUnlockTime={liquidityUnlockTime}
            setLiquidityUnlockTime={setLiquidityUnlockTime}
            launchRate={launchRate}
            setLaunchRate={setLaunchRate}
            liquidityProvider={liquidityProvider}
            setLiquidityProvider={setLiquidityProvider}
            tokenSymbol={tokenSymbol}
            liquidityToken={liquidityToken}
            liquidityTokenName={liquidityTokenName}
            userTokenBalance={userTokenBalance}
            setTotalTokenNeeded={setTotalTokenNeeded}
            isLiquidityBurn={isLiquidityBurn}
            setIsLiquidityBurn={setIsLiquidityBurn}
          />
        }

        {
          stepNumber === 4 &&
          <AdditionalInfo
            setStepNumberParent={setStepNumber}
            logoURL={logoURL}
            setLogoURL={setLogoURL}
            coverImageUrl={coverImageUrl}
            setCoverImageUrl={setCoverImageUrl}
            kycLink={kycLink}
            setKycLink={setKycLink}
            auditedLink={auditedLink}
            setAuditedLink={setAuditedLink}
            safuLink={safuLink}
            setSafuLink={setSafuLink}
            poocoinLink={poocoinLink}
            setPoocoinLink={setPoocoinLink}
            website={website}
            setWebsite={setWebsite}
          />
        }

        {/* {
          stepNumber === 2 &&
          <Review
          tokenAddress={tokenAddress}
          totalTokenNeeded={totalTokenNeeded}
          tokenSymbol={tokenSymbol}
          tokenName={tokenName}
          tokenDecimals={tokenDecimals}
          liquidityProvider={liquidityProvider}
          tokensPerBNB={tokensPerBNB}
          launchRate={launchRate}
          setStepNumberParent={setStepNumber}
          projectName={projectName}
          minimumBuy={minimumBuy}
          maximumBuy={maximumBuy}
          liquidityTokenName={liquidityTokenName}
          liquidityToken={liquidityToken}
          softCap={softCap}
          hardCap={hardCap}
          liquidityPercentage={liquidityPercentage}
          startTime={startTime}
          endTime={endTime}
          liquidityUnlockTime={liquidityUnlockTime}
          isWhitelistingEnabled={isWhitelistingEnabled}
          publicStartTime={publicStartTime}
          logoURL={logoURL}
          coverImageUrl={coverImageUrl}
          website={website}
          facebookLink={facebookLink}
          twitterLink={twitterLink}
          githubLink={githubLink}
          telegramLink={telegramLink}
          instagramLink={instagramLink}
          discordLink={discordLink}
          redditLink={redditLink}
          description={description}
          isVestingEnabled={isVestingEnabled}
          initialTokenReleasePercentage={initialTokenReleasePercentage}
          vestingCyclesInDays={vestingCyclesInDays}
          tokenReleasePercentageInCycle={tokenReleasePercentageInCycle}
          youtubeLink={youtubeLink}
          kycLink={kycLink}
          auditedLink={auditedLink}
          safuLink={safuLink}
          poocoinLink={poocoinLink}
          isLiquidityBurn={isLiquidityBurn}
          />
        } */}
      </Card>
    </div>
  )
}

export default CreatePresale