import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAppContext } from "../hooks/useAppContext";
import { Button, Card, Alert, Container } from "react-bootstrap";
import { loginUser } from "../services/userService";

export default function Home() {
  const { user, setUser, loading, setLoading } = useAppContext(); // Get loading state from AppContext

  const handleLogin = async () => {
    setLoading(true); // Set loading to true when starting the login
    await loginUser(); // Simulate login (you can replace with real API call)
    setUser({ id: "1", name: "Scott" }); // Set the user after login
    setLoading(false); // Set loading to false when login is complete
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-3">Home Page</h1>

      {loading ? (
        <LoadingSpinner />
      ) : user ? (
        <Card>
          <Card.Body>
            <Card.Title>Welcome!</Card.Title>
            <Card.Text>Welcome, {user.name}!</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="info">
          <p>You are not logged in. Please log in to continue.</p>
          <Button onClick={handleLogin} variant="primary">
            Log in as Scott
          </Button>
        </Alert>
      )}
    </Container>
  );
}
