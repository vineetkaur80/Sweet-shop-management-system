

import request from "supertest";
import { app } from "../src/app";
import mongoose from "mongoose";
import User from "../src/models/User";
import Sweet from "../src/models/Sweet";
import jwt from "jsonwebtoken";
import { describe, it, beforeAll, afterAll, expect } from "@jest/globals";

describe("Sweets API", () => {
  let adminToken: string;
  let userToken: string;
  let sweetId: string;

  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/sweetshop_test"
    );

    // Create admin
    const admin = new User({ username: "admin", password: "pw", role: "admin" });
    await admin.save();
    adminToken = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || "secret"
    );

    // Create user
    const user = new User({ username: "buyer", password: "pw", role: "user" });
    await user.save();
    userToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret"
    );

    // Seed sweets
    await Sweet.insertMany([
      { name: "Chocolate", category: "Soft", price: 20, quantity: 5 },
      { name: "Candy", category: "Hard", price: 5, quantity: 20 },
      { name: "Lollipop", category: "Hard", price: 10, quantity: 15 },
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  // ---------------- GET ----------------

  it("GET /api/sweets should return all sweets", async () => {
    const res = await request(app).get("/api/sweets");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(3);
  });

  // ---------------- CREATE ----------------

  it("POST /api/sweets should fail for non-admin", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "New Sweet", price: 1, category: "Hard", quantity: 10 });

    expect(res.statusCode).toBe(403);
  });

  it("POST /api/sweets should succeed for admin", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "New Sweet", price: 1, category: "Hard", quantity: 10 });

    expect(res.statusCode).toBe(201);
    sweetId = res.body._id;
  });

  // ---------------- SEARCH ----------------

  it("should search sweets by name (partial, case-insensitive)", async () => {
    const res = await request(app).get("/api/sweets/search?q=choco");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Chocolate");
  });
  // 
  // Add inside describe("Sweets API")
it("GET /api/sweets/:id should return a single sweet", async () => {
  // Create a sweet first
  const sweet = new Sweet({ name: "Single", category: "Test", price: 1, quantity: 1 });
  await sweet.save();

  const res = await request(app).get(`/api/sweets/${sweet._id}`);
  expect(res.statusCode).toBe(200);
  expect(res.body.name).toBe("Single");
});

  it("should filter sweets by category", async () => {
    const res = await request(app).get("/api/sweets/search?category=Hard");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(3);
  });

  it("should filter sweets by price range", async () => {
    const res = await request(app).get(
      "/api/sweets/search?minPrice=6&maxPrice=15"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Lollipop");
  });

  it("should combine name, category, and price filters", async () => {
    const res = await request(app).get(
      "/api/sweets/search?q=can&category=Hard&maxPrice=10"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Candy");
  });

  it("GET /api/sweets/search with no query should return all sweets", async () => {
    const res = await request(app).get("/api/sweets/search");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(5);
  });

  // ---------------- UPDATE ----------------

  it("PUT /api/sweets/:id should fail for non-admin", async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ price: 2 });

    expect(res.statusCode).toBe(403);
  });

  it("PUT /api/sweets/:id should update sweet for admin", async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(2);
  });

  // ---------------- DELETE ----------------

  it("DELETE /api/sweets/:id should fail for non-admin", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("DELETE /api/sweets/:id should delete sweet for admin", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Sweet deleted");
  });

  it("DELETE /api/sweets/:id should return 404 if already deleted", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });
});

