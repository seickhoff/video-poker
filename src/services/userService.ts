export interface User {
  id: string;
  name: string;
}

// Mock API call function to simulate a user login
export const loginUser = async (): Promise<User> => {
  // Simulate an async operation (e.g., network delay) using async/await
  await new Promise<void>((resolve) => setTimeout(resolve, 1000)); // Mock delay
  return { id: "1", name: "Scott" }; // Return the mock user data after the delay
};
