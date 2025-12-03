import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import './TigerLilyTopBar.less';

const TigerLilyTopBar: React.FC = () => {
    const theme = useTheme();

    return (
        <AppBar
            position="static"
            className="tiger-lily-top-bar"
            sx={{
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[2],
            }}
        >
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        color: theme.palette.text.primary,
                        fontFamily: theme.typography.fontFamily,
                        fontWeight: theme.typography.h6.fontWeight,
                        letterSpacing: theme.typography.h6.letterSpacing,
                        textTransform: theme.typography.h6.textTransform as 'uppercase',
                    }}
                >
                    Tiger Lily SAR
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default TigerLilyTopBar;