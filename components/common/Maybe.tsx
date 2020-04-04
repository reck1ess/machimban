import React from "react";

interface MaybeProps {
  test: boolean;
  children: React.ReactNode;
}

const Maybe = ({ test, children }: MaybeProps) => (
  <React.Fragment>{test && children}</React.Fragment>
);

export default Maybe;
