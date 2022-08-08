import Link from "next/link";
import { useEffect } from "react";

export default ({ currentUser }) => {
  const labels = [
    !currentUser && { label: "signup", href: "/auth/signup" },
    !currentUser && { label: "signin", href: "/auth/signin" },
    currentUser && { label: "signout", href: "/auth/signout" },
    currentUser && { label: "CreateTicket", href: "/tickets/new" },
    currentUser && { label: "MyOrders", href: "/orders" },
  ]
    .filter((object) => object)
    .map((object) => {
      return (
        <li key={object.href} className="nav-item ">
          <Link href={object.href}>
            <a className="nav-link" style={{ fontSize: "20px" }}>
              {object.label}
            </a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="nav navbar-light bg-light" style={{ height: "10%" }}>
      <div className="d-flex justify-content-end m-3">
        <Link href={"/"}>
          <a className="navbar-brand m-3" style={{ fontSize: "20px" }}>
            GitTix
          </a>
        </Link>
        <ul className="nav d-flex align-items-center">{labels}</ul>
      </div>
    </nav>
  );
};
