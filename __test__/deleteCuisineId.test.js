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

describe("DELETE /cuisines/1", () => {
  test("Success delete cuisines", async () => {
    const response = await request(app)
      .delete("/cuisines/1")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Cuisine id 1 success to delete"
    );
  });
  test("Not login", async () => {
    const response = await request(app).delete("/cuisines/1");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
  test("Invalid token", async () => {
    const response = await request(app)
      .delete("/cuisines/1")
      .set("Authorization", `Bearer test`);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
  test("Id not in the database", async () => {
    const response = await request(app)
      .delete("/cuisines/3")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "id 3, error not found");
  });
  test("Forbidden delete", async () => {
    const response = await request(app)
      .delete("/cuisines/1")
      .set("Authorization", `Bearer ${token2}`);
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "Forbidden");
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
