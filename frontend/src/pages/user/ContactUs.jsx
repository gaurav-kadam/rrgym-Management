import {
    Box,
    Button,
    Container,
    TextField,
    Typography
} from "@mui/material";
import ParrallaxTitle from "../../components/shared/ParrallaxTitle";
export default function ContactUs() {
    return (
        <>
            <ParrallaxTitle Title={"ContactUs"} />
            <Container maxWidth={false} sx={{ py: 8 }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "60% 40%",   // 🔥 FIXED
                        gap: 6,
                        alignItems: "start"
                    }}
                >
                    {/* LEFT FORM */}
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Contact us
                        </Typography>

                        <Typography color="text.secondary" sx={{ mb: 4 }}>
                            Contact us about anything related to our company or services.
                        </Typography>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 3
                            }}
                        >
                            {/* Row 1 */}
                            <TextField label="Name *" fullWidth />
                            <TextField label="Phone Number" fullWidth />

                            {/* Row 2 */}
                            <TextField label="Email *" fullWidth />
                            <TextField label="Company" fullWidth />

                            {/* Row 3 */}
                            <Box sx={{ gridColumn: "1 / -1" }}>
                                <TextField label="Subject *" fullWidth />
                            </Box>

                            {/* Row 4 */}
                            <Box sx={{ gridColumn: "1 / -1" }}>
                                <TextField
                                    label="Message *"
                                    multiline
                                    rows={6}
                                    fullWidth
                                />
                                <Typography variant="caption" color="text.secondary">
                                    We typically respond within 1–2 business days.
                                </Typography>
                            </Box>

                            {/* Row 5 */}
                            <Box sx={{ gridColumn: "1 / -1" }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: "#000",
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: "10px",
                                        textTransform: "none",
                                        "&:hover": { bgcolor: "#222" }
                                    }}
                                >
                                    Send Message
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    {/* RIGHT IMAGE */}
                    <Box
                        sx={{
                            marginRight: 7,
                            height: "100%",
                            minHeight: 550
                        }}
                    >
                        <Box
                            component="img"
                            src="/assets/contactus.webp"
                            alt="Contact"
                            sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "16px"
                            }}
                        />
                    </Box>
                </Box>
            </Container>

        </>
    );
}
