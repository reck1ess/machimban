import React from "react";

const useIsMounted = () => {
  const [isMounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  return isMounted;
};

export default useIsMounted;
