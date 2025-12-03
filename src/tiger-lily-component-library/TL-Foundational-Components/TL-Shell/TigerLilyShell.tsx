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
      className={`tiger-lily-shell ${className || ""}`}
      test-py="tiger-lily-shell"
    >
      {leftDrawer && (
        <Box
          className="tiger-lily-shell__left-drawer"
          test-py="tiger-lily-shell-left-drawer"
        >
          {leftDrawer}
        </Box>
      )}

      <Box
        className="tiger-lily-shell__main-content"
        test-py="tiger-lily-shell-main-content"
      >
        {children}
      </Box>

      {rightDrawer && (
        <Box
          className="tiger-lily-shell__right-drawer"
          test-py="tiger-lily-shell-right-drawer"
        >
          {rightDrawer}
        </Box>
      )}
    </Box>
  );
};

export default TigerLilyShell;
