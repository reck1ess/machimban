import React from "react";

import { LOADING_IMAGE_SOURCE } from "../../lib/utils/constant";

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <style>
      {`
        .loading-spinner {
          position: fixed;
          width: 25px;
          top: calc(50vh - 12.5px);
          left: calc(50vw - 12.5px);
          content: url(${LOADING_IMAGE_SOURCE});
          animation: loading  1s steps(12) infinite;
          z-index: 9999;
        }

        @media screen and (min-width: 476px) {
          width: 30px;
          top: calc(50vh - 15px);
          left: calc(50vw - 15px);
        }

        @media screen and (min-width: 768px) {
          width: 40px;
          top: calc(50vh - 20px);
          left: calc(50vw - 20px);
        }

        @keyframes loading {
          from  {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}
    </style>
  </div>
);

export default LoadingSpinner;
