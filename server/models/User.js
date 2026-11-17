const mongoose = require('mongoose');
const crypto = require('crypto');
const { dbState } = require('../config/db');
const { readDB, writeDB } = require('../data/localStore');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    theme: {
      type: String,
      enum: ['dreamy', 'cozy', 'midnight', 'playful'],
      default: 'dreamy',
    },
  },
  {
    timestamps: true,
  }
);

let MongooseUser;
try {
  MongooseUser = mongoose.model('User', userSchema);
} catch {
  MongooseUser = mongoose.models.User;
}

const User = {
  schema: userSchema,
  mongooseModel: MongooseUser,

  async findOne(query) {
    if (dbState.mode === 'mongodb') {
      return await MongooseUser.findOne(query);
    }
    const db = readDB();
    if (query.email) {
      const email = query.email.toLowerCase().trim();
      const u = db.users.find((x) => x.email.toLowerCase() === email);
      return u ? { ...u, id: u._id } : null;
    }
    return null;
  },

  async findById(id) {
    if (dbState.mode === 'mongodb') {
      return await MongooseUser.findById(id);
    }
    const db = readDB();
    const u = db.users.find((x) => String(x._id) === String(id));
    return u ? { ...u, id: u._id } : null;
  },

  async create(userData) {
    if (dbState.mode === 'mongodb') {
      const doc = await MongooseUser.create(userData);
      return doc;
    }
    const db = readDB();
    const newUser = {
      _id: crypto.randomUUID(),
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      theme: userData.theme || 'dreamy',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    writeDB(db);
    return { ...newUser, id: newUser._id };
  },

  async findByIdAndUpdate(id, updates, options = {}) {
    if (dbState.mode === 'mongodb') {
      return await MongooseUser.findByIdAndUpdate(id, updates, { new: true, ...options });
    }
    const db = readDB();
    const index = db.users.findIndex((x) => String(x._id) === String(id));
    if (index === -1) return null;
    db.users[index] = {
      ...db.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    writeDB(db);
    const u = db.users[index];
    return { ...u, id: u._id };
  },
};

module.exports = User;
