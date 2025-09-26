export type MockUser = {
  id: number;
  email: string;
  password: string;
  name: string;
};

export const users: MockUser[] = [
  {
    id: 1,
    email: "user@example.com",
    password: "password123",
    name: "Jane Doe",
  },
];
