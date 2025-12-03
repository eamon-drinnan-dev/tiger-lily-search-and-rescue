import React from "react";
import './TigerLilyCoreWrapper.less';

interface TigerLilyCoreWrapperInterface {
    children: React.ReactNode;
}

const TigerLilyCoreWrapper: React.FC<TigerLilyCoreWrapperInterface> = ({ children }) => {
    return (
        <div className="tiger-lily-core-wrapper">
            {children}
        </div>
    );
}

export default TigerLilyCoreWrapper;