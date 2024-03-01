const request = require("supertest");
const app = require("..");
const { User, Category } = require("../models");
const { signToken } = require("../helpers/jwt");

let token;
beforeAll(async () => {
  let user = await User.create({
    email: "staff@gmail.com",
    password: "staff",
  });
  await Category.create({
    name: "Example Category 1",
  });

  token = signToken({ id: user.id });
});

describe("POST /cuisines", () => {
  test("Success create cuisines", async () => {
    const dummyData = {
      name: "Example Cuisine 1",
      description: "This is an example description for the first cuisine.",
      price: 10,
      imgUrl: "http://example.com/image1.jpg",
      categoryId: 1,
      authorId: 1,
    };
    const response = await request(app)
      .post("/cuisines")
      .set("Authorization", `Bearer ${token}`)
      .send(dummyData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("name", expect.any(String));
    expect(response.body).toHaveProperty("description", expect.any(String));
    expect(response.body).toHaveProperty("price", expect.any(Number));
    expect(response.body).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body).toHaveProperty("categoryId", expect.any(Number));
    expect(response.body).toHaveProperty("authorId", expect.any(Number));
  });
  test("Not login", async () => {
    const dummyData = {
      name: "Example Cuisine 1",
      description: "This is an example description for the first cuisine.",
      price: 10,
      imgUrl: "http://example.com/image1.jpg",
      categoryId: 1,
      authorId: 1,
    };
    const response = await request(app).post("/cuisines").send(dummyData);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
  test("Invalid token", async () => {
    const dummyData = {
      name: "Example Cuisine 1",
      description: "This is an example description for the first cuisine.",
      price: 10,
      imgUrl: "http://example.com/image1.jpg",
      categoryId: 1,
      authorId: 1,
    };
    const response = await request(app)
      .post("/cuisines")
      .set("Authorization", `Bearer test`)
      .send(dummyData);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
  test("Validation required", async () => {
    const dummyData = {
      name: "",
      description: "",
      price: 0.8,
      imgUrl: "",
    };
    const response = await request(app)
      .post("/cuisines")
      .set("Authorization", `Bearer ${token}`)
      .send(dummyData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", [
      "categoryId should not be null",
      "name should not be empty",
      "description should not be empty",
      "Min price = $1",
      "imgUrl should not be empty",
    ]);
  });
});

afterAll(async () => {
  await User.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await Category.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});
