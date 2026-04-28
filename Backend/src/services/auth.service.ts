import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const JWT_SECRET =
  process.env.JWT_SECRET || "supersecret";

export const registerService =
  async (
    email: string,
    password: string
  ) => {
    const existing =
      await prisma.user.findUnique({
        where: { email },
      });

    if (existing) {
      throw new Error(
        "Email already exists"
      );
    }

    const hashed =
      await bcrypt.hash(password, 10);

    const user =
      await prisma.user.create({
        data: {
          email,
          password: hashed,
        },
      });

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  };

export const loginService =
  async (
    email: string,
    password: string
  ) => {
    const user =
      await prisma.user.findUnique({
        where: { email },
      });

    if (!user) {
      throw new Error(
        "Invalid credentials"
      );
    }

    const ok =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!ok) {
      throw new Error(
        "Invalid credentials"
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  };

export const meService =
  async (userId: string) => {
    const user =
      await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

    return user;
  };