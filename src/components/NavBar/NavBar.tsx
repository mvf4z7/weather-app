import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "./NavBar.css";

type Props = {
  items: Array<{ path: string; text: string; exact?: boolean }>;
  title: string;
};

function NavBar({ items, title }: Props) {
  return (
    <nav>
      <div>{title}</div>
      <ul className="NavBar__list">
        {items.map(item => (
          <li className="NavBar__list-item" key={`${item.text}_${item.path}`}>
            <NavLink
              to={item.path}
              exact={item.exact}
              className="NavBar__NavLink"
              activeClassName="NavBar__NavLink--active"
            >
              {item.text}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavBar;
