import { Container, Card } from "react-bootstrap";

export default function Settings() {
  return (
    <Container className="mt-4">
      <h1 className="mb-3">Settings</h1>

      {/* Display filters in a Bootstrap Card */}
      <Card>
        <Card.Body>
          <Card.Title>Settings</Card.Title>
        </Card.Body>
      </Card>
    </Container>
  );
}
