import React from "react";
import { Box } from "@mui/material";
import "./TigerLilyShell.less";

export interface TigerLilyShellProps {
  className?: string;
  leftDrawer?: React.ReactNode;
  rightDrawer?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * TigerLilyShell
 * @description Main layout container below TopBar. Manages left drawer, main content area, and optional right drawer in a horizontal flex layout.
 * @example
 * <TigerLilyShell leftDrawer={<LeftDrawer />}>
 *   <CesiumMap />
 * </TigerLilyShell>
 */
const TigerLilyShell: React.FC<TigerLilyShellProps> = ({
  className,
  leftDrawer,
  rightDrawer,
  children,
}) => {
  return (
    <Box
      className={`tiger-lily-body ${className || ""}`}
      test-py="tiger-lily-body"
    >
      {leftDrawer && (
        <Box
          className="tiger-lily-body__left-drawer"
          test-py="tiger-lily-body-left-drawer"
        >
          {leftDrawer}
        </Box>
      )}

      <Box
        className="tiger-lily-body__main-content"
        test-py="tiger-lily-body-main-content"
      >
        {children}
      </Box>

      {rightDrawer && (
        <Box
          className="tiger-lily-body__right-drawer"
          test-py="tiger-lily-body-right-drawer"
        >
          {rightDrawer}
        </Box>
      )}
    </Box>
  );
};

export default TigerLilyShell;
