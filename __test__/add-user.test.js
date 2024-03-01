const request = require("supertest");
const app = require("..");
const { User } = require("../models");
const { signToken } = require("../helpers/jwt");

let token;
beforeAll(async () => {
  let user = await User.create({
    email: "staff@gmail.com",
    password: "staff",
  });
  token = signToken({ id: user.id });
});

describe("POST /add-user", () => {
  test("Success add-user", async () => {
    const dummyData = {
      email: "staff1@gmail.com",
      password: "staff",
    };
    const response = await request(app)
      .post("/add-user")
      .set("Authorization", `Bearer ${token}`)
      .send(dummyData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("email", dummyData.email);
  });
  test("Email is null", async () => {
    const dummyData = {
      password: "staff",
    };
    const response = await request(app)
      .post("/add-user")
      .set("Authorization", `Bearer ${token}`)
      .send(dummyData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", [
      "email should not be null",
    ]);
  });
  test("Password is null", async () => {
    const dummyData = {
      email: "staff1@gmail.com",
    };
    const response = await request(app)
      .post("/add-user")
      .set("Authorization", `Bearer ${token}`)
      .send(dummyData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", [
      "password should not be null",
    ]);
  });
  test("Email is empty", async () => {
    const dummyData = {
      email: "",
      password: "staff",
    };
    const response = await request(app)
      .post("/add-user")
      .set("Authorization", `Bearer ${token}`)
      .send(dummyData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", [
      "Validation isEmail on email failed",
      "email should not be empty",
    ]);
  });
  test("Password is empty", async () => {
    const dummyData = {
      email: "staff1@gmail.com",
      password: "",
    };
    const response = await request(app)
      .post("/add-user")
      .set("Authorization", `Bearer ${token}`)
      .send(dummyData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", [
      "Password minimal length = 5 ",
      "password should not be empty",
    ]);
  });
  test("Email already exist", async () => {
    const dummyData = {
      email: "staff@gmail.com",
      password: "staff",
    };
    const response = await request(app)
      .post("/add-user")
      .set("Authorization", `Bearer ${token}`)
      .send(dummyData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", ["email must be unique"]);
  });
  test("Not a valid Email", async () => {
    const dummyData = {
      email: "test",
      password: "staff",
    };
    const response = await request(app)
      .post("/add-user")
      .set("Authorization", `Bearer ${token}`)
      .send(dummyData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", [
      "Validation isEmail on email failed",
    ]);
  });
  test("No access token", async () => {
    const dummyData = {
      email: "test",
      password: "staff",
    };
    const response = await request(app).post("/add-user").send(dummyData);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
  test("Invalid token", async () => {
    const dummyData = {
      email: "test",
      password: "staff",
    };
    const response = await request(app)
      .post("/add-user")
      .set("Authorization", `Bearer test`)
      .send(dummyData);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
});

afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });
});
