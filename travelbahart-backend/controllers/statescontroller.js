const State = require('../models/State');

// ─── PUBLIC ────────────────────────────────────────────────────────────────

// GET /api/states
exports.getAllStates = async (req, res) => {
  try {
    const { category, region, search } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (region)   filter.region   = region;
    if (search) {
      filter.$or = [
        { name:            { $regex: search, $options: 'i' } },
        { 'places.name':   { $regex: search, $options: 'i' } },
        { 'places.city':   { $regex: search, $options: 'i' } },
      ];
    }

    const states = await State.find(filter).select('-__v');
    res.json({ success: true, count: states.length, data: states });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/states/:id
exports.getState = async (req, res) => {
  try {
    const state = await State.findOne({ id: req.params.id, isActive: true });
    if (!state)
      return res.status(404).json({ success: false, message: 'State not found' });
    res.json({ success: true, data: state });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/states/search/places — search across all places
exports.searchPlaces = async (req, res) => {
  try {
    const { q, category } = req.query;
    if (!q && !category)
      return res.status(400).json({ success: false, message: 'Provide q or category param' });

    const states = await State.find({ isActive: true });
    const results = [];

    states.forEach(state => {
      state.places.forEach(place => {
        const matchQ = !q ||
          place.name.toLowerCase().includes(q.toLowerCase()) ||
          place.city.toLowerCase().includes(q.toLowerCase()) ||
          place.desc.toLowerCase().includes(q.toLowerCase()) ||
          state.name.toLowerCase().includes(q.toLowerCase());
        const matchCat = !category || place.category === category;
        if (matchQ && matchCat) {
          results.push({ ...place.toObject(), stateName: state.name, stateId: state.id });
        }
      });
    });

    res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── ADMIN (protected) ─────────────────────────────────────────────────────

// POST /api/states
exports.createState = async (req, res) => {
  try {
    const existing = await State.findOne({ id: req.body.id });
    if (existing)
      return res.status(400).json({ success: false, message: 'State ID already exists' });

    const state = await State.create(req.body);
    res.status(201).json({ success: true, data: state });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/states/:id
exports.updateState = async (req, res) => {
  try {
    const state = await State.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!state)
      return res.status(404).json({ success: false, message: 'State not found' });
    res.json({ success: true, data: state });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/states/:id  (soft delete)
exports.deleteState = async (req, res) => {
  try {
    const state = await State.findOneAndUpdate(
      { id: req.params.id },
      { isActive: false },
      { new: true }
    );
    if (!state)
      return res.status(404).json({ success: false, message: 'State not found' });
    res.json({ success: true, message: `${state.name} deactivated` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PLACES within a state ─────────────────────────────────────────────────

// POST /api/states/:id/places
exports.addPlace = async (req, res) => {
  try {
    const state = await State.findOne({ id: req.params.id });
    if (!state)
      return res.status(404).json({ success: false, message: 'State not found' });

    state.places.push(req.body);
    await state.save();
    res.status(201).json({ success: true, data: state.places[state.places.length - 1] });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/states/:id/places/:placeId
exports.updatePlace = async (req, res) => {
  try {
    const state = await State.findOne({ id: req.params.id });
    if (!state)
      return res.status(404).json({ success: false, message: 'State not found' });

    const place = state.places.find(p => p.id === req.params.placeId);
    if (!place)
      return res.status(404).json({ success: false, message: 'Place not found' });

    Object.assign(place, req.body);
    await state.save();
    res.json({ success: true, data: place });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/states/:id/places/:placeId
exports.deletePlace = async (req, res) => {
  try {
    const state = await State.findOne({ id: req.params.id });
    if (!state)
      return res.status(404).json({ success: false, message: 'State not found' });

    state.places = state.places.filter(p => p.id !== req.params.placeId);
    await state.save();
    res.json({ success: true, message: 'Place removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};