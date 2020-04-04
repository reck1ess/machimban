import Link from "next/link";
import React from "react";

interface CustomLinkProps {
  href: string;
  as: string;
  children: React.ReactNode;
  onClick?: (e: any) => void;
}

const CustomLink = ({ href, as, children, onClick }: CustomLinkProps) => (
  <Link href={href} as={as} passHref>
    <a style={{ color: "#000", textDecoration: "none" }} onClick={onClick}>
      {children}
    </a>
  </Link>
);

export default CustomLink;
