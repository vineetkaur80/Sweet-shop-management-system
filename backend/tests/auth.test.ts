// import request from "supertest";
// import { app } from "../src/app";

// import mongoose from "mongoose";

// describe("Auth Endpoints", () => {
//   beforeAll(async () => {
//     await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/sweetshop_test");
//   });

//   afterAll(async () => {
//     await mongoose.connection.dropDatabase();
//     await mongoose.connection.close();
//   });

//  it("should register a user", async () => {
//   const res = await request(app)
//     .post("/api/auth/register")
//     .send({
//       username: "loginuser",
//       password: "pw12345"
//     });

//   expect(res.statusCode).toBe(201);
//   expect(res.body).toHaveProperty("message", "User created");
// });

//   it("should login an existing user", async () => {
//   // create user first
//   await request(app)
//     .post("/api/auth/register")
//     .send({
//       username: "loginuser",
//       password: "pw12345"
//     });

//   const res = await request(app)
//     .post("/api/auth/login")
//     .send({
//       username: "loginuser",
//       password: "pw12345"
//     });

//   expect(res.statusCode).toBe(200);
//   expect(res.body).toHaveProperty("token");
// });

// });


import request from "supertest";
import { app } from "../src/app";
import mongoose from "mongoose";

describe("Auth Endpoints", () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/sweetshop_test"
    );
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  // ---------------- REGISTER ----------------

  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser",
        password: "pw12345",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User created");
  });

  it("should not allow duplicate username registration", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "duplicateuser",
        password: "pw12345",
      });

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "duplicateuser",
        password: "pw12345",
      });

    expect(res.statusCode).toBe(500);
  });

  it("should fail registration if fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "incomplete",
      });

    expect(res.statusCode).toBe(500);
  });

  // ---------------- LOGIN ----------------

  it("should login an existing user", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "loginuser",
        password: "pw12345",
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        username: "loginuser",
        password: "pw12345",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        username: "loginuser",
        password: "wrongpassword",
      });

    expect(res.statusCode).toBe(401);
  });

  it("should fail login for non-existing user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        username: "nouser",
        password: "pw12345",
      });

    expect(res.statusCode).toBe(401);
  });
});
