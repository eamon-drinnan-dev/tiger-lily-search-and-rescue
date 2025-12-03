import TigerLilyTopBar from "./tiger-lily-component-library/TL-TopBar/TigerLilyTopBar";
import TigerLilyRoot from "./tiger-lily-component-library/TL-Root/TigerLilyRoot";
import TigerLilyLeftDrawer from "./tiger-lily-component-library/TL-LeftDrawer/TigerLilyLeftDrawer";
import TigerLilyShell from "./tiger-lily-component-library/TL-Body/TigerLilyShell";

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
