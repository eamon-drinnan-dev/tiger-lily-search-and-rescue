import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './TigerLilyTopBar.less';

const TigerLilyTopBar: React.FC = () => {
    return (
        <AppBar
            position="static"
            className="tiger-lily-top-bar"
        >
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    className="tiger-lily-top-bar__menu-button"
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    variant="h6"
                    component="div"
                    className="tiger-lily-top-bar__title"
                >
                    Tiger Lily SAR
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default TigerLilyTopBar;