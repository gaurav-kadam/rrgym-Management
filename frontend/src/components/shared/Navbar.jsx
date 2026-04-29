import * as React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

import MenuIcon from "@mui/icons-material/Menu";
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import GYM_CONFIG from "../../config/gymConfig";

const pages = [
    { name: "Home", path: "/" },
    { name: "AboutUs", path: "/aboutus" },
    { name: "PricingPlans", path: "/pricing" },
    { name: "Services", path: "/services" },
    { name: "Gallery", path: "/gallery" },
];

export default function Navbar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [user, setUser] = React.useState(null);

    const navigate = useNavigate();

    // ✅ Check login session
    React.useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await authService.getMe();
                setUser(res.data?.data || null);
            } catch (error) {
                setUser(null);
            }
        };

        checkUser();
    }, []);

    // ✅ Logout function
    const handleLogout = async () => {
        try {
            await authService.logout();
            setUser(null);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <AppBar
            position="sticky"
            elevation={1}
            sx={{ backgroundColor: "#ffffff", color: "#000000" }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>

                    {/* LOGO */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
                        <img
                            src={GYM_CONFIG.logoBlack}
                            alt={GYM_CONFIG.name}
                            style={{ height: 40 }}
                        />
                    </Box>

                    {/* MOBILE MENU */}
                    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                        <IconButton onClick={(e) => setAnchorElNav(e.currentTarget)}>
                            <MenuIcon sx={{ color: "#000" }} />
                        </IconButton>

                        <Menu
                            anchorEl={anchorElNav}
                            open={Boolean(anchorElNav)}
                            onClose={() => setAnchorElNav(null)}
                        >
                            {pages.map((page) => (
                                <MenuItem
                                    key={page.name}
                                    component={Link}
                                    to={page.path}
                                    onClick={() => setAnchorElNav(null)}
                                >
                                    <Typography>{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* DESKTOP LINKS */}
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                component={NavLink}
                                to={page.path}
                                sx={{
                                    my: 2,
                                    px: 2,
                                    color: "#000",
                                    textTransform: "none",
                                    "&.active": {
                                        backgroundColor: "#000",
                                        color: "#fff",
                                    },
                                }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    {/* CONTACT BUTTON */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
                        <Button
                            variant="contained"
                            component={Link}
                            to="/contact"
                            sx={{
                                backgroundColor: "#000",
                                "&:hover": { backgroundColor: "#333" },
                            }}
                        >
                            Contact Us
                        </Button>
                    </Box>

                    {/* LOGIN / AVATAR */}
                    {!user ? (
                        <Button
                            variant="outlined"
                            component={Link}
                            to="/login"
                            sx={{
                                borderColor: "#000",
                                color: "#000",
                                textTransform: "none",
                                "&:hover": {
                                    borderColor: "#000",
                                    backgroundColor: "#f5f5f5",
                                },
                            }}
                        >
                            Login
                        </Button>
                    ) : (
                        <Box>
                            <Tooltip title="Open settings">
                                <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)}>
                                    <Avatar
                                        src={
                                            user?.image
                                                ? `http://52.62.38.76:3000/uploads/${user.image}`
                                                : ""
                                        }
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            border: "2px solid #000"
                                        }}
                                    >
                                        {!user?.image &&
                                            user?.email?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>

                            <Menu
                                anchorEl={anchorElUser}
                                open={Boolean(anchorElUser)}
                                onClose={() => setAnchorElUser(null)}
                            >
                                <MenuItem
                                    onClick={() => {
                                        navigate("/profile");
                                        setAnchorElUser(null);
                                    }}
                                >
                                    Profile
                                </MenuItem>

                                <MenuItem
                                    onClick={() => {
                                        navigate("/bmi");
                                        setAnchorElUser(null);
                                    }}
                                >
                                    Calculate BMI
                                </MenuItem>

                                <MenuItem onClick={handleLogout}>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}