const request = require("supertest");
const app = require("..");
const { User, Category, Cuisine } = require("../models");
const { signToken } = require("../helpers/jwt");

let token;
let token2;
beforeAll(async () => {
  let user = await User.create({
    email: "admin@gmail.com",
    password: "admin",
    role: "admin",
  });
  let user2 = await User.create({
    email: "staff@gmail.com",
    password: "staff",
  });
  await Category.create({
    name: "Example Category 1",
  });
  await Cuisine.create({
    name: "Example Cuisine 1",
    description: "This is an example description for the first cuisine.",
    price: 10,
    imgUrl: "http://example.com/image1.jpg",
    categoryId: 1,
    authorId: 1,
  });
  await Cuisine.create({
    name: "Example Cuisine 2",
    description: "This is an example description for the second cuisine.",
    price: 20,
    imgUrl: "http://example.com/image2.jpg",
    categoryId: 1,
    authorId: 2,
  });
  token = signToken({ id: user.id });
  token2 = signToken({ id: user2.id });
});

describe("GET /categories", () => {
  test("Success get categories", async () => {
    const response = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("name");
  });
  test("Not login", async () => {
    const response = await request(app).get("/categories");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
  test("Invalid token", async () => {
    const response = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer test`);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
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
  await Cuisine.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});
