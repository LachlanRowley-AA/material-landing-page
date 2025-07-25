import { 
    Comparison,
    ContactForm, 
    Header, 
    Features, 
    Hero, 
    Journey,
    Testimonial,
    Why,
    Intro,
 } from '@/components/Partner'
import {
    Footer01
} from '@/components/footer/footer'

export default function PartnerPage() {
    return (
        <div>
            <Header />
            <Hero />
            {/* <Why /> */}
            <Intro />
            <Features />
            <Comparison />
            <Journey />
            <Testimonial />
            <section id ="contact"><ContactForm /></section>
            <Footer01 />
        </div>
    )
}