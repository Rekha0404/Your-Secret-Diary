const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', entryController.getEntries);
router.post('/', entryController.createEntry);
router.get('/summary/weekly', entryController.getWeeklySummary);
router.get('/:id', entryController.getEntryById);
router.put('/:id', entryController.updateEntry);
router.delete('/:id', entryController.deleteEntry);

module.exports = router;
