import TigerLilyTopBar from "./tiger-lily-component-library/TL-TopBar/TigerLilyTopBar";
import TigerLilyCoreWrapper from "./tiger-lily-component-library/TL-Core-Wrapper/TigerLilyCoreWrapper";
import TigerLilyLeftDrawer from "./tiger-lily-component-library/TL-LeftDrawer/TigerLilyLeftDrawer";
function TigerLily() {
  return (
    <TigerLilyCoreWrapper>
      <TigerLilyLeftDrawer />
      <TigerLilyTopBar />
    </TigerLilyCoreWrapper>
  );
}

export default TigerLily;
