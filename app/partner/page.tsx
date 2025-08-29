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
    Products
 } from '@/components/Partner'
import {
    Footer01
} from '@/components/footer/footer'
import {
    Example
} from '@/components/Partner/Example'

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
            <Example />
            {/* <Products /> */}
            <Testimonial />
            <section id ="contact"><ContactForm /></section>
            <Footer01 />
        </div>
    )
}