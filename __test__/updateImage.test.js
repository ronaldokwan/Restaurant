const request = require("supertest");
const app = require("..");
const { User, Category, Cuisine } = require("../models");
const { signToken } = require("../helpers/jwt");

const path = require("path");
const fs = require("fs");
const filePath = path.resolve(__dirname, "../1.png");
const imageBuffer = fs.readFileSync(filePath);

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

describe("PATCH /cuisines/1/img-url", () => {
  test("Success patch image", async () => {
    const response = await request(app)
      .patch("/cuisines/1/img-url")
      .set("Authorization", `Bearer ${token}`)
      .attach("img", imageBuffer, "1.png");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Image id 1 success to update"
    );
  });
  test("Not login", async () => {
    const response = await request(app)
      .patch("/cuisines/1/img-url")
      .attach("img", imageBuffer, "1.png");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
  test("Invalid token", async () => {
    const response = await request(app)
      .patch("/cuisines/1/img-url")
      .set("Authorization", `Bearer test`)
      .attach("img", imageBuffer, "1.png");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
  test("Id not in the database", async () => {
    const response = await request(app)
      .patch("/cuisines/3/img-url")
      .set("Authorization", `Bearer ${token}`)
      .attach("img", imageBuffer, "1.png");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "id 3, error not found");
  });
  test("Forbidden patch", async () => {
    const response = await request(app)
      .patch("/cuisines/1/img-url")
      .set("Authorization", `Bearer ${token2}`)
      .attach("img", imageBuffer, "1.png");
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "Forbidden");
  });
  test("Forbidden patch", async () => {
    const response = await request(app)
      .patch("/cuisines/1/img-url")
      .set("Authorization", `Bearer ${token}`)
      .attach("im");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "File is required");
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
