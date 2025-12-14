// BACKEND/tests/inventory.test.ts
import request from "supertest";
import { app } from "../src/app";
import mongoose from "mongoose";
import Sweet from "../src/models/Sweet";
import User from "../src/models/User";
import jwt from "jsonwebtoken";
import { describe, beforeEach, it, beforeAll, afterAll, expect } from "@jest/globals";

describe("Inventory Operations", () => {
  let userToken: string;
  let adminToken: string;
  let sweetId: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/sweetshop_test");

    // Create User
    const user = new User({ username: "buyer", password: "pw", role: "user" });
    await user.save();
    userToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secret");

    // Create Admin
    const admin = new User({ username: "boss", password: "pw", role: "admin" });
    await admin.save();
    adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || "secret");
  });

  beforeEach(async () => {
    // Reset sweet before each test
    await Sweet.deleteMany({});
    const sweet = new Sweet({ name: "KitKat", category: "Choco", price: 10, quantity: 1 });
    const saved = await sweet.save();
    sweetId = saved._id.toString();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("POST /purchase should decrement quantity", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 1 });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(0);
  });

  it("POST /purchase should fail if out of stock", async () => {
    // Buy 1 (Stock becomes 0)
    await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 1 });

    // Try buying 1 more
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 1 });
    
    expect(res.statusCode).toBe(400); // Bad Request
    expect(res.body).toHaveProperty("error");
  });

  it("POST /restock should increment quantity (Admin only)", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 10 });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(11); // 1 initial + 10 added
  });
  
});
