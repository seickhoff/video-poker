import { useAppContext } from "../hooks/useAppContext";
import { useDashboardContext } from "../hooks/useDashboardContext";
import { Container, Card, Button, ListGroup, Alert } from "react-bootstrap";

export default function DashboardOverview() {
  const { user } = useAppContext(); // Get logged-in user
  const { filters, setFilters } = useDashboardContext(); // Dashboard-specific state

  return (
    <Container className="mt-4">
      <h1>Dashboard Overview</h1>

      {/* User Info */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>User Info</Card.Title>
          <Card.Text>
            {user ? `Logged in as: ${user.name}` : "No user logged in"}
          </Card.Text>
        </Card.Body>
      </Card>

      {/* Filters */}
      <Card>
        <Card.Body>
          <Card.Title>Filters</Card.Title>
          <Button
            variant="primary"
            onClick={() =>
              setFilters([...filters, `Filter ${filters.length + 1}`])
            }
          >
            Add Filter
          </Button>

          {filters.length > 0 ? (
            <ListGroup className="mt-3">
              {filters.map((filter, index) => (
                <ListGroup.Item key={index}>{filter}</ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Alert variant="warning" className="mt-3">
              No filters applied
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
