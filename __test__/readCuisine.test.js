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

describe("GET /cuisines", () => {
  test("Success read cuisines", async () => {
    const response = await request(app)
      .get("/cuisines")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("description");
    expect(response.body[0]).toHaveProperty("price");
    expect(response.body[0]).toHaveProperty("imgUrl");
    expect(response.body[0]).toHaveProperty("categoryId");
    expect(response.body[0]).toHaveProperty("authorId");
  });
  test("Not login", async () => {
    const response = await request(app).get("/cuisines");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
  test("Invalid token", async () => {
    const response = await request(app)
      .get("/cuisines")
      .set("Authorization", `Bearer test`);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
});

afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });
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
