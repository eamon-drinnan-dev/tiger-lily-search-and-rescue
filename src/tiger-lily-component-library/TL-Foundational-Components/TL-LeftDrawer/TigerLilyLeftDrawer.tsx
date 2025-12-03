import React from "react";
import { Box } from "@mui/material";
import "./TigerLilyLeftDrawer.less";

export interface TigerLilyLeftDrawerProps {
  className?: string;
}

/**
 * TigerLilyLeftDrawer
 * @description Fixed-width left navigation drawer. Part of static layout (not overlay).
 * @example
 * <TigerLilyLeftDrawer />
 */
const TigerLilyLeftDrawer: React.FC<TigerLilyLeftDrawerProps> = ({
  className,
}) => {
  return (
    <Box
      className={`tiger-lily-left-drawer ${className || ""}`}
      test-py="tiger-lily-left-drawer"
    >
      <Box
        className="tiger-lily-left-drawer__content"
        test-py="tiger-lily-left-drawer-content"
      >
        {/* Drawer content will go here */}
      </Box>
    </Box>
  );
};

export default TigerLilyLeftDrawer;
