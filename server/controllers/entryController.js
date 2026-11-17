const Entry = require('../models/Entry');

exports.getEntries = async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.userId });
    return res.status(200).json({
      success: true,
      count: entries.length,
      entries: entries.map((e) => ({
        id: String(e._id || e.id),
        _id: String(e._id || e.id),
        title: e.title,
        content: e.content,
        mood: e.mood,
        date: e.date,
        media: e.media || [],
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      })),
    });
  } catch (error) {
    console.error('getEntries error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve diary entries.',
      error: error.message,
    });
  }
};

exports.getEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Entry.findById(id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'This diary page could not be found.',
      });
    }

    if (String(entry.user) !== String(req.userId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this secret entry.',
      });
    }

    return res.status(200).json({
      success: true,
      entry: {
        id: String(entry._id || entry.id),
        _id: String(entry._id || entry.id),
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        date: entry.date,
        media: entry.media || [],
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      },
    });
  } catch (error) {
    console.error('getEntryById error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve diary entry.',
      error: error.message,
    });
  }
};

exports.createEntry = async (req, res) => {
  try {
    const { title, content, mood, date, media } = req.body;

    const todayStr = new Date().toISOString().slice(0, 10);
    const entryData = {
      user: req.userId,
      title: title?.trim() || 'A little day',
      content: content || '',
      mood: mood || '😊',
      date: date || todayStr,
      media: Array.isArray(media) ? media : [],
    };

    const newEntry = await Entry.create(entryData);

    return res.status(201).json({
      success: true,
      message: 'Memory saved safely in your diary ♡',
      entry: {
        id: String(newEntry._id || newEntry.id),
        _id: String(newEntry._id || newEntry.id),
        title: newEntry.title,
        content: newEntry.content,
        mood: newEntry.mood,
        date: newEntry.date,
        media: newEntry.media || [],
        createdAt: newEntry.createdAt,
        updatedAt: newEntry.updatedAt,
      },
    });
  } catch (error) {
    console.error('createEntry error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create diary entry.',
      error: error.message,
    });
  }
};

exports.updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Entry.findById(id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'This diary page could not be found.',
      });
    }

    if (String(entry.user) !== String(req.userId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this entry.',
      });
    }

    const { title, content, mood, date, media } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title.trim() || 'A little day';
    if (content !== undefined) updates.content = content;
    if (mood !== undefined) updates.mood = mood;
    if (date !== undefined) updates.date = date;
    if (media !== undefined && Array.isArray(media)) updates.media = media;

    const updated = await Entry.findByIdAndUpdate(id, updates, { new: true });

    return res.status(200).json({
      success: true,
      message: 'Memory updated safely ♡',
      entry: {
        id: String(updated._id || updated.id),
        _id: String(updated._id || updated.id),
        title: updated.title,
        content: updated.content,
        mood: updated.mood,
        date: updated.date,
        media: updated.media || [],
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error) {
    console.error('updateEntry error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update diary entry.',
      error: error.message,
    });
  }
};

exports.deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Entry.findById(id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'This diary page could not be found.',
      });
    }

    if (String(entry.user) !== String(req.userId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this entry.',
      });
    }

    await Entry.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Diary page quietly deleted ♡',
    });
  } catch (error) {
    console.error('deleteEntry error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete diary entry.',
      error: error.message,
    });
  }
};

exports.getWeeklySummary = async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.userId });
    const recent = entries.slice(0, 7);

    const counts = {};
    let totalMedia = 0;

    recent.forEach((e) => {
      if (e.mood) counts[e.mood] = (counts[e.mood] || 0) + 1;
      if (e.media) totalMedia += e.media.length;
    });

    const dominantMood = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '🌷';

    let moodDescription = 'peaceful and balanced';
    let reflectionText = 'You gave this week a little piece of yourself.';
    let suggestion = 'Take time to pause and celebrate small wins this coming week.';

    if (['🥰', '😊'].includes(dominantMood)) {
      moodDescription = 'joyful and uplifting';
      reflectionText = 'Your entries carry lightness and gentle warmth. Happiness looks good on you.';
      suggestion = 'Carry this positive energy forward and share a smile with someone you love.';
    } else if (['😔', '😤', '😴'].includes(dominantMood)) {
      moodDescription = 'heavy and demanding';
      reflectionText = 'You carried a lot in your heart this week. Writing it down is the first step towards healing.';
      suggestion = 'Be extra kind to yourself tonight. Drink some warm tea, rest well, and remember bad days always pass.';
    } else if (['😌', '🌷', '🥹'].includes(dominantMood)) {
      moodDescription = 'quiet and deeply reflective';
      reflectionText = 'A week of mindful presence, gentle appreciation, and meaningful quiet moments.';
      suggestion = 'Continue listening to your inner voice—it is guiding you to peace.';
    }

    return res.status(200).json({
      success: true,
      stats: {
        recentCount: recent.length,
        totalEntries: entries.length,
        moodCounts: counts,
        dominantMood,
        moodDescription,
        totalMedia,
      },
      reflection: {
        headline: recent.length ? reflectionText : 'Your week is still a blank canvas.',
        summary: recent.length
          ? `Over your recent ${recent.length} ${recent.length === 1 ? 'entry' : 'entries'}, your most frequent emotion was ${dominantMood} (${moodDescription}). You captured ${totalMedia} media memories.`
          : 'Write a few diary pages first, then come back here to see your week come together.',
        suggestion,
      },
    });
  } catch (error) {
    console.error('getWeeklySummary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate weekly summary.',
      error: error.message,
    });
  }
};
