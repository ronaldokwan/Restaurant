const request = require("supertest");
const app = require("..");
const { User } = require("../models");

beforeAll(async () => {
  await User.create({
    email: "admin@gmail.com",
    password: "admin",
    role: "admin",
  });
});

describe("POST /login", () => {
  test("Success login", async () => {
    const dummyData = {
      email: "admin@gmail.com",
      password: "admin",
    };

    const response = await request(app).post("/login").send(dummyData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("email", dummyData.email);
    expect(response.body).toHaveProperty("token", expect.any(String));
  });
  test("Email is empty", async () => {
    const dummyData = {
      password: "admin",
    };
    const response = await request(app).post("/login").send(dummyData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "emailRequired");
  });
  test("Password is empty", async () => {
    const dummyData = {
      email: "admin@gmail.com",
    };
    const response = await request(app).post("/login").send(dummyData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "passwordRequired");
  });
  test("Invalid email", async () => {
    const dummyData = {
      email: "admintest@gmail.com",
      password: "admin",
    };
    const response = await request(app).post("/login").send(dummyData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "error invalid email or password"
    );
  });
  test("Invalid password", async () => {
    const dummyData = {
      email: "admin@gmail.com",
      password: "adminTest",
    };
    const response = await request(app).post("/login").send(dummyData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "error invalid email or password"
    );
  });
});

afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });
});
