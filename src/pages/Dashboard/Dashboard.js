import React, { useEffect } from 'react'
// import BackgroundStars from '../../components/BackgroundStars/BackgroundStars'
import LandingSection from '../../components/DashboardComponents/LandingSection'
import FeaturesSection from '../../components/DashboardComponents/FeaturesSection'
import './Dashboard.css'

function Dashboard() {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div>

      {/* <BackgroundStars /> */}
      <div>
        <LandingSection />
      </div>

      <div className='mt-5'>
        <FeaturesSection />
      </div>

    </div>
  )
}

export default Dashboard