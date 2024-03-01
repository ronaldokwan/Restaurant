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

describe("GET /pub/cuisines", () => {
  test("Success get public cuisines", async () => {
    const response = await request(app).get("/pub/cuisines");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("page", 1);
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("totalData", 27);
    expect(response.body).toHaveProperty("totalPage", 3);
    expect(response.body).toHaveProperty("dataPerPage", 10);
  });
  test("Success filter public cuisines", async () => {
    const response = await request(app).get("/pub/cuisines?filter=1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("page", 1);
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("totalData", 14);
    expect(response.body).toHaveProperty("totalPage", 2);
    expect(response.body).toHaveProperty("dataPerPage", 10);
  });
  test("Success get page public cuisines", async () => {
    const response = await request(app).get(
      "/pub/cuisines?page[number]=2&page[size]=10"
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("page", 2);
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("totalData", 27);
    expect(response.body).toHaveProperty("totalPage", 3);
    expect(response.body).toHaveProperty("dataPerPage", 10);
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
