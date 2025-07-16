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


export default function PartnerPage() {
    return (
        <div>
            <Header />
            <Hero />
            <Why />
            <Features />
            <Comparison />
            <Journey />
            <Testimonial />
            <ContactForm />
        </div>
    )
}