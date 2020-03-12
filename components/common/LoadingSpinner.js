import React from "react";

import { LOADING_IMAGE_SOURCE } from "../../lib/utils/constant";

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <style>
      {`
        .loading-spinner {
          content: url(${LOADING_IMAGE_SOURCE});
          animation: loading  1s steps(12) infinite;
          width: 10vw;
          position: fixed;
          top: calc(50vh - 5vw);
          left: 45vw;
          z-index: 9999;
        }

        @keyframes loading {
          from  {
            transform: rotate(0deg);
          }
          to {transform: rotate(360deg);}
        }
      `}
    </style>
  </div>
);

export default LoadingSpinner;
