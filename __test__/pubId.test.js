const request = require("supertest");
const app = require("..");
const { User, Category, Cuisine } = require("../models");

beforeAll(async () => {
  await User.create({
    email: "admin@gmail.com",
    password: "admin",
    role: "admin",
  });
  await User.create({
    email: "staff@gmail.com",
    password: "staff",
  });
  await Category.create({
    name: "Example Category 1",
  });
  await Category.create({
    name: "Example Category 2",
  });
  let data = require("../data/cuisines.json");
  await Cuisine.bulkCreate(data);
});

describe("GET /pub/cuisines/1", () => {
  test("Success get public id cuisines", async () => {
    const response = await request(app).get("/pub/cuisines/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("price");
    expect(response.body).toHaveProperty("imgUrl");
    expect(response.body).toHaveProperty("categoryId");
    expect(response.body).toHaveProperty("authorId");
  });
  test("Id not in the database", async () => {
    const response = await request(app).get("/pub/cuisines/100");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "id 100, error not found");
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
