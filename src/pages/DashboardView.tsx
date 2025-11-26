import { useDashboardContext } from "../hooks/useDashboardContext";
import { Container, Card, Alert } from "react-bootstrap";

export default function DashboardView() {
  const { filters } = useDashboardContext();

  return (
    <Container className="mt-4">
      <h1 className="mb-3">Dashboard - View</h1>

      {/* Display filters in a Bootstrap Card */}
      <Card>
        <Card.Body>
          <Card.Title>Filters</Card.Title>
          {filters.length > 0 ? (
            <Card.Text>{filters.join(", ")}</Card.Text>
          ) : (
            <Alert variant="warning">No filters applied</Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
