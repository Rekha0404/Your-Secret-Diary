const mongoose = require('mongoose');
const crypto = require('crypto');
const { dbState } = require('../config/db');
const { readDB, writeDB } = require('../data/localStore');

const mediaSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    type: { type: String, default: 'image/jpeg' },
    url: { type: String, required: true },
  },
  { _id: false }
);

const entrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'A little day',
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    mood: {
      type: String,
      default: '😊',
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    media: [mediaSchema],
  },
  {
    timestamps: true,
  }
);

let MongooseEntry;
try {
  MongooseEntry = mongoose.model('Entry', entrySchema);
} catch {
  MongooseEntry = mongoose.models.Entry;
}

const Entry = {
  schema: entrySchema,
  mongooseModel: MongooseEntry,

  async find(query = {}) {
    if (dbState.mode === 'mongodb') {
      return await MongooseEntry.find(query).sort({ date: -1, createdAt: -1 });
    }
    const db = readDB();
    let list = db.entries;
    if (query.user) {
      list = list.filter((e) => String(e.user) === String(query.user));
    }
    return list
      .map((e) => ({ ...e, id: e._id }))
      .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
  },

  async findById(id) {
    if (dbState.mode === 'mongodb') {
      return await MongooseEntry.findById(id);
    }
    const db = readDB();
    const entry = db.entries.find((e) => String(e._id) === String(id));
    return entry ? { ...entry, id: entry._id } : null;
  },

  async create(data) {
    if (dbState.mode === 'mongodb') {
      return await MongooseEntry.create(data);
    }
    const db = readDB();
    const now = new Date().toISOString();
    const newEntry = {
      _id: crypto.randomUUID(),
      user: String(data.user),
      title: data.title || 'A little day',
      content: data.content || '',
      mood: data.mood || '😊',
      date: data.date || now.slice(0, 10),
      media: data.media || [],
      createdAt: now,
      updatedAt: now,
    };
    db.entries.unshift(newEntry);
    writeDB(db);
    return { ...newEntry, id: newEntry._id };
  },

  async findByIdAndUpdate(id, data, options = {}) {
    if (dbState.mode === 'mongodb') {
      return await MongooseEntry.findByIdAndUpdate(id, data, { new: true, ...options });
    }
    const db = readDB();
    const index = db.entries.findIndex((e) => String(e._id) === String(id));
    if (index === -1) return null;

    db.entries[index] = {
      ...db.entries[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    writeDB(db);
    const updated = db.entries[index];
    return { ...updated, id: updated._id };
  },

  async findByIdAndDelete(id) {
    if (dbState.mode === 'mongodb') {
      return await MongooseEntry.findByIdAndDelete(id);
    }
    const db = readDB();
    const index = db.entries.findIndex((e) => String(e._id) === String(id));
    if (index === -1) return null;
    const [removed] = db.entries.splice(index, 1);
    writeDB(db);
    return { ...removed, id: removed._id };
  },
};

module.exports = Entry;
