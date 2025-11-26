import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

interface NavRoute {
  path?: string;
  label: string;
  children?: NavRoute[];
}

// Define the navRoutes configuration
const navRoutes: NavRoute[] = [
  { path: "/", label: "Home" },
  {
    label: "Dashboard",
    children: [
      { path: "/dashboard/overview", label: "Overview" },
      { path: "/dashboard/view", label: "View" },
      {
        label: "Analytics",
        children: [
          { path: "/dashboard/analytics/reports", label: "Reports" },
          { path: "/dashboard/analytics/stats", label: "Stats" },
        ],
      },
    ],
  },
  { path: "/settings", label: "Settings" },
];

const AppNavbar: React.FC = () => {
  const location = useLocation();
  const [expanded, setExpanded] = React.useState(false);

  const handleSelect = () => setExpanded(false);

  const isActive = (path?: string) =>
    path && location.pathname.startsWith(path) ? "active" : "";

  const renderNavItems = (routes: NavRoute[]) => {
    return routes.map((route, index) => {
      if (route.children) {
        // Check if the children also have children (nested dropdown case)
        const hasNestedDropdown = route.children.some(
          (child) => child.children
        );

        return hasNestedDropdown ? (
          <NavDropdown
            key={index}
            title={route.label}
            id={`navbar-${route.label}`}
          >
            {route.children.map((child, childIndex) =>
              child.children ? (
                // Nested Dropdown
                <NavDropdown
                  key={childIndex}
                  title={child.label}
                  id={`nav-dropdown-${child.label}`}
                  drop="end"
                >
                  {child.children.map((subChild, subIndex) => (
                    <NavDropdown.Item
                      key={subIndex}
                      as={Link}
                      to={subChild.path!}
                      className={isActive(subChild.path)}
                      onClick={handleSelect}
                    >
                      {subChild.label}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              ) : (
                <NavDropdown.Item
                  key={childIndex}
                  as={Link}
                  to={child.path!}
                  className={isActive(child.path)}
                  onClick={handleSelect}
                >
                  {child.label}
                </NavDropdown.Item>
              )
            )}
          </NavDropdown>
        ) : (
          // Regular Dropdown
          <NavDropdown
            key={index}
            title={route.label}
            id={`navbar-${route.label}`}
          >
            {route.children.map((child, childIndex) => (
              <NavDropdown.Item
                key={childIndex}
                as={Link}
                to={child.path!}
                className={isActive(child.path)}
                onClick={handleSelect}
              >
                {child.label}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        );
      }

      // Regular Nav Link
      return (
        <Nav.Link
          key={index}
          as={Link}
          to={route.path || "#"}
          className={isActive(route.path)}
          onClick={handleSelect}
        >
          {route.label}
        </Nav.Link>
      );
    });
  };

  return (
    <Navbar bg="light" expand="lg" expanded={expanded} onToggle={setExpanded}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="/vite.svg" // Referring to public/logo.png
            alt="MyApp Logo"
            height="40"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">{renderNavItems(navRoutes)}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
