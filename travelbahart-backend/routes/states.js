const express = require('express');
const router  = express.Router();

const {
  getAllStates,
  getState,
  searchPlaces,
  createState,
  updateState,
  deleteState,
  addPlace,
  updatePlace,
  deletePlace,
} = require('../controllers/statescontroller');

const { protect, superAdminOnly } = require('../middleware/Auth');

// ── Public Routes ───────────────────────────────────────────
router.get('/',                getAllStates);
router.get('/search/places',   searchPlaces);
router.get('/:id',             getState);

// ── Admin Protected Routes ──────────────────────────────────
router.post('/',               protect, createState);
router.put('/:id',             protect, updateState);
router.delete('/:id',          protect, superAdminOnly, deleteState);

// ── Places within a State ───────────────────────────────────
router.post('/:id/places',              protect, addPlace);
router.put('/:id/places/:placeId',      protect, updatePlace);
router.delete('/:id/places/:placeId',   protect, deletePlace);

module.exports = router;