import React from "react";
import './TigerLilyRoot.less';

interface TigerLilyRootInterface {
    children: React.ReactNode;
}

const TigerLilyRoot: React.FC<TigerLilyRootInterface> = ({ children }) => {
    return (
        <div className="tiger-lily-root">
            {children}
        </div>
    );
}

export default TigerLilyRoot;