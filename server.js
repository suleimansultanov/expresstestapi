const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();


let items = Array.from({ length: 1000000 }, (_, i) => ({
  id: i + 1,
  value: `Элемент ${i + 1}`,
  selected: false,
}));

app.use(cors());
app.use(bodyParser.json());


app.get('/api/items', (req, res) => {
  const search = req.query.search || '';
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 20;

  let filtered = items;
  if (search) {
    filtered = items.filter(item =>
      item.value.toLowerCase().includes(search.toLowerCase())
    );
  }

  const result = filtered.slice(offset, offset + limit);

  res.json({ items: result, total: filtered.length });
});


app.post('/api/items/select', (req, res) => {
  const { id, selected } = req.body;
  const item = items.find(item => item.id === id);
  if (item) {
    item.selected = selected;
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});


app.post('/api/items/move', (req, res) => {
  const { fromIndex, toIndex } = req.body;
  if (
    fromIndex < 0 || toIndex < 0 ||
    fromIndex >= items.length || toIndex >= items.length
  ) {
    return res.status(400).json({ error: 'Invalid indexes' });
  }
  const [movedItem] = items.splice(fromIndex, 1);
  items.splice(toIndex, 0, movedItem);
  res.json({ success: true });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express сервер запущен на http://localhost:${PORT}`);
});
