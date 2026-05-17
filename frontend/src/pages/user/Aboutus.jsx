import { Box, Container, Typography } from "@mui/material";
import ContentWithLeftImage from "../../components/shared/ContentWithLeftImage";
import ContentWithRightImage from "../../components/shared/ContentWithRightImage";
import HeadingSubheading from "../../components/shared/HeadingSubheading";
import ParrallaxTitle from "../../components/shared/ParrallaxTitle";
import Trainer from "../../components/shared/Trainer";
export default function AboutUs() {
    return (
        <>

            {/* Parallax Title Section */}
            <ParrallaxTitle Title="AboutUs" />
            <ContentWithRightImage
                heading="Enhance Your Workout Experience"
                description="Our gym offers a variety of services, including personal training, group fitness classes, and nutrition coaching. Let us help you achieve your fitness goals.
At our gym, we prioritize our customers' needs and work hard to provide them with the best possible fitness experience."
                imageSrc="/assets/img11.jpg"
                imageAlt="Wellness"
            />

            <ContentWithLeftImage
                heading="Discover New Fitness Goals"
                description="Our gym offers a variety of services, including personal training, group fitness classes, and nutrition coaching. Let us help you achieve your fitness goals.
            At our gym, we prioritize our customers' needs and work hard to provide them with the best possible fitness experience."
                imageSrc="/assets/img12.jpg"
            />
            {/* Banner Section */}
            <Box
                sx={{
                    height: { xs: 300, md: 400 },
                    backgroundImage: `url(/assets/bgimg.jpg)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        bgcolor: "rgba(0,0,0,0.25)",
                    }}
                />
                <Container sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                    <Typography
                        variant="h3"
                        sx={{
                            color: "#fff",
                            fontWeight: "bold",
                            textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
                            lineHeight: 1.2,
                        }}
                    >
                        Welcome to our gym.<br />
                        Experience fitness like never before.
                    </Typography>
                </Container>
            </Box>
            <HeadingSubheading heading={"Meet Our Tainers"} subHeading={"Dedicated trainers committed to your success"} />
            <Trainer />


        </>
    );
}
