import React from "react";

const BlankContainer = () => (
  <div className="blank-container">
    <style jsx>
      {`
        .blank-container {
          width: 100vw;
          height: 100vh;
          background-image: linear-gradient(45deg, #e9ecef 25%, transparent 25%),
            linear-gradient(-45deg, #e9ecef 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #e9ecef 75%),
            linear-gradient(-45deg, transparent 75%, #e9ecef 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}
    </style>
  </div>
);

export default BlankContainer;
