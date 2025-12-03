import React, { useState, useCallback, useEffect } from "react";
import { Drawer, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "./TigerLilyLeftDrawer.less";

const MIN_DRAWER_WIDTH = 200;
const MAX_DRAWER_WIDTH = 600;
const DEFAULT_DRAWER_WIDTH = 280;

export interface TigerLilyLeftDrawerProps {
  className?: string;
  open?: boolean;
}

const TigerLilyLeftDrawer: React.FC<TigerLilyLeftDrawerProps> = ({
  className,
  open = true,
}) => {
  const theme = useTheme();
  const [drawerWidth, setDrawerWidth] = useState(DEFAULT_DRAWER_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = useCallback(() => {
    setIsResizing(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX;
        if (newWidth >= MIN_DRAWER_WIDTH && newWidth <= MAX_DRAWER_WIDTH) {
          setDrawerWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <Drawer
      variant="permanent"
      open={open}
      className={className}
      test-py="tiger-lily-left-drawer"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: isResizing
            ? "none"
            : theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        test-py="tiger-lily-left-drawer-content"
      >
        {/* Drawer content will go here */}

        {/* Resize handle */}
        <Box
          onMouseDown={handleMouseDown}
          className="tiger-lily-left-drawer__resize-handle"
          data-cy="tiger-lily-left-drawer-resize-handle"
          sx={{
            width: theme.spacing(0.5),
            "&:hover": {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        />
      </Box>
    </Drawer>
  );
};

export default TigerLilyLeftDrawer;
