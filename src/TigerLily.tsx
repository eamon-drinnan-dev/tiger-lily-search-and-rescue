import TigerLilyTopBar from "./tiger-lily-component-library/TL-Foundational-Components/TL-TopBar/TigerLilyTopBar";
import TigerLilyRoot from "./tiger-lily-component-library/TL-Foundational-Components/TL-Root/TigerLilyRoot";
import TigerLilyLeftDrawer from "./tiger-lily-component-library/TL-Foundational-Components/TL-LeftDrawer/TigerLilyLeftDrawer";
import TigerLilyShell from "./tiger-lily-component-library/TL-Foundational-Components/TL-Shell/TigerLilyShell";

function TigerLily() {
  return (
    <TigerLilyRoot>
      <TigerLilyTopBar />
      <TigerLilyShell leftDrawer={<TigerLilyLeftDrawer />}>
        {/* Main content area - Cesium map and panels will go here */}
      </TigerLilyShell>
    </TigerLilyRoot>
  );
}

export default TigerLily;
