import { Box, Container } from "@mui/material";
import ParrallaxTitle from "../../components/shared/ParrallaxTitle";

const images = [
    { src: "/assets/img1.jpeg", span: "big" },
    { src: "/assets/img2.jpeg", span: "tall" },
    { src: "/assets/img3.jpeg" },
    { src: "/assets/img4.jpeg" },
    { src: "/assets/img5.jpeg" },
    { src: "/assets/img6.jpeg", span: "big" },
    { src: "/assets/img7.jpeg", span: "tall" },
];

export default function Gallery() {
    return (<>
        <ParrallaxTitle Title={"Our GYM Gallery"} />
        <Box sx={{ py: 6, backgroundColor: "#fff" }}>

            <Container maxWidth="lg">
                {/* GALLERY GRID */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(12, 1fr)",
                        gridAutoRows: "220px",
                        gap: "24px",
                        marginTop: 5
                    }}
                >
                    {/* BIG LEFT IMAGE */}
                    <GalleryItem
                        src={images[0].src}
                        sx={{ gridColumn: "span 8", gridRow: "span 2" }}
                    />

                    {/* TALL RIGHT IMAGE */}
                    <GalleryItem
                        src={images[1].src}
                        sx={{ gridColumn: "span 4", gridRow: "span 2" }}
                    />

                    {/* BOTTOM IMAGES */}
                    <GalleryItem
                        src={images[2].src}
                        sx={{ gridColumn: "span 4" }}
                    />
                    <GalleryItem
                        src={images[3].src}
                        sx={{ gridColumn: "span 4" }}
                    />
                    <GalleryItem
                        src={images[4].src}
                        sx={{ gridColumn: "span 4" }}
                    />
                    <GalleryItem
                        src={images[5].src}
                        sx={{ gridColumn: "span 8", gridRow: "span 2" }}
                    />

                    {/* TALL RIGHT IMAGE */}
                    <GalleryItem
                        src={images[6].src}
                        sx={{ gridColumn: "span 4", gridRow: "span 2" }}
                    />
                </Box>
            </Container>
        </Box >

    </>
    );
}

function GalleryItem({ src, sx }) {
    return (
        <Box
            sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 3,
                cursor: "pointer",
                ...sx,
            }}
        >
            {/* IMAGE */}
            <Box
                component="img"
                src={src}
                alt="gallery"
                sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                }}
            />

            {/* OVERLAY */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.25)",
                    opacity: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "opacity 0.4s ease",
                    "& svg": {
                        backgroundColor: "#fff",
                        color: "#000",
                        borderRadius: "50%",
                        padding: "12px",
                        fontSize: 40,
                    },
                    "&:hover": {
                        opacity: 1,
                    },
                    "&:hover img": {
                        transform: "scale(1.1)",
                    },
                }}
            >

            </Box>
        </Box>
    );
}
