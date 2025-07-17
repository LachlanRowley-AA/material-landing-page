import { 
    Comparison,
    ContactForm, 
    Header, 
    Features, 
    Hero, 
    Journey,
    Testimonial,
    Why,
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
            <Features />
            <Comparison />
            <Journey />
            <Testimonial />
            <section id ="contact"><ContactForm /></section>
            <Footer01 />
        </div>
    )
}