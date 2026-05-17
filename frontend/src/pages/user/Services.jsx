import { Container } from "@mui/material";
import ParrallaxTitle from '../../components/shared/ParrallaxTitle';
import QuoteCarousel from "../../components/shared/QuoteCarousel";
import ServiceCard from "../../components/shared/ServiceCard";
export default function Services() {
    return (<>
        <ParrallaxTitle Title={"Services"} />
        <Container sx={{
            marginTop: 10,
            marginBottom: 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            transition: "transform 0.3s, box-shadow 0.3s"
        }}>
            <ServiceCard image="/assets/img1.jpeg" heading={"Unique Fitness Equipment"} description={"To join our gym is to join a community of fitness enthusiasts: Their passion put in the execution of their workouts, their hours of training, their dedication... It is a committed, healthy act, which encourages a responsible and active lifestyle."} />
            <ServiceCard image="/assets/img11.jpg" heading={"Tailored fitness plans"} description={"Whether it is to help you achieve your fitness goals, to confirm a workout plan or when you have no idea about the exercises to do, our trainers are there to accompany you throughout your fitness journey."} />
            <ServiceCard image="/assets/img12.jpg" heading={"For the whole Family"} description={"Every week our gym offers new classes. Some are only available for a limited period of time."} />
        </Container>
        <QuoteCarousel />
    </>);
}
