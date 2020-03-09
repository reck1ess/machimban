import Link from "next/link";

const CustomLink = ({ href, as, children, onClick }) => (
  <Link href={href} as={as} passHref>
    <a style={{ color: "#000", textDecoration: "none" }} onClick={onClick}>
      {children}
    </a>
  </Link>
);

export default CustomLink;
