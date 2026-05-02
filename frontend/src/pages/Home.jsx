import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsLetterBox from '../components/NewsLetterBox'
import ScrollReveal from '../components/ScrollReveal'

const Home = () => {
    return (
        <div className='space-y-4'>
            <Hero />
            <ScrollReveal>
                <LatestCollection />
            </ScrollReveal>
            <ScrollReveal>
                <BestSeller />
            </ScrollReveal>
            <ScrollReveal>
                <OurPolicy />
            </ScrollReveal>
            <ScrollReveal>
                <NewsLetterBox />
            </ScrollReveal>
        </div>
    )
}

export default Home
