import React from "react";
import { INITIAL_STORE_STATE } from "../utils/constant";

const StoreContext = React.createContext(INITIAL_STORE_STATE);

export default StoreContext;
