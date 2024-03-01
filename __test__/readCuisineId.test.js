const request = require("supertest");
const app = require("..");
const { User, Category, Cuisine } = require("../models");
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
  await Cuisine.create({
    name: "Example Cuisine 1",
    description: "This is an example description for the first cuisine.",
    price: 10,
    imgUrl: "http://example.com/image1.jpg",
    categoryId: 1,
    authorId: 1,
  });
  token = signToken({ id: user.id });
});

describe("GET /cuisines/1", () => {
  test("Success read cuisines", async () => {
    const response = await request(app)
      .get("/cuisines/1")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("price");
    expect(response.body).toHaveProperty("imgUrl");
    expect(response.body).toHaveProperty("categoryId");
    expect(response.body).toHaveProperty("authorId");
  });
  test("Not login", async () => {
    const response = await request(app).get("/cuisines/1");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
  test("Invalid token", async () => {
    const response = await request(app)
      .get("/cuisines/1")
      .set("Authorization", `Bearer test`);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
  test("Id not in the database", async () => {
    const response = await request(app)
      .get("/cuisines/2")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "id 2, error not found");
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
