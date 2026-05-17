import { Box, Container, Typography } from "@mui/material";
export default function ParrallaxTitle({ Title }) {
    return (
        <Box
            sx={{
                height: { xs: 150, md: 150 },
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
            <Container sx={{ position: "relative", zIndex: 2, textAlign: "start" }}>
                <Typography
                    variant="h2"
                    sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
                    }}
                >
                    {Title}
                </Typography>
            </Container>
        </Box>
    );
}
