import TigerLilyTopBar from "./tiger-lily-component-library/TL-Foundational-Components/TL-TopBar/TigerLilyTopBar";
import TigerLilyRoot from "./tiger-lily-component-library/TL-Foundational-Components/TL-Root/TigerLilyRoot";
import TigerLilyLeftDrawer from "./tiger-lily-component-library/TL-Foundational-Components/TL-LeftDrawer/TigerLilyLeftDrawer";
import TigerLilyShell from "./tiger-lily-component-library/TL-Foundational-Components/TL-Shell/TigerLilyShell";
import { TigerLilyMap } from "./tiger-lily-map-core/TigerLilyMap";

function TigerLily() {
  return (
    <TigerLilyRoot>
      <TigerLilyTopBar />
      <TigerLilyShell leftDrawer={<TigerLilyLeftDrawer />}>
        <TigerLilyMap />
      </TigerLilyShell>
    </TigerLilyRoot>
  );
}

export default TigerLily;
