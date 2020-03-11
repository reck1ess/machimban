import React from "react";

const ClusterIcon = ({ pointCount, total }) => (
  <div className="marker-presenter">
    <span className="store-count">{pointCount}</span>
    <style jsx>{`
      .marker-presenter {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #000;
        width: ${`${30 + (pointCount / total) * 60}px`};
        height: ${`${30 + (pointCount / total) * 60}px`};
        border-radius: 50%;
        background: #8c7ae6;
        box-shadow: 0 0 0 3px #b197fc, 0 0 0 6px #d0bfff, 0 0 0 9px #e5dbff;
      }
      .store-count {
        font-size: 14px;
        font-weight: 600;
      }
    `}</style>
  </div>
);

export default ClusterIcon;
