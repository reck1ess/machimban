import React from "react";

const ClusterIcon = ({ totalRemain }) => (
  <div className="marker-container">
    <div className="marker-presenter">
      <span className="remain-stock">{totalRemain}+</span>
    </div>
    <style jsx>{`
      .marker-container {
        position: relative;
        &:hover,
        &:active {
          z-index: 2;
          box-shadow: 0 0 0 4px #f3f0ff, 0 0 0 6px #e5dbff, 0 0 0 10px #9575cd;
        }
      }
      .marker-presenter {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #000;
        width: 55px;
        height: 55px;
        border-radius: 50%;
        background: #d0bfff;
        box-shadow: 0 0 0 4px #e5dbff, 0 0 0 6px #f3f0ff,
          0 0 0 10px rgba(255, 255, 255, 0.1);
      }
      .remain-stock {
        font-size: 14px;
        font-weight: 600;
        opacity: 0.99;
      }
    `}</style>
  </div>
);

export default ClusterIcon;
