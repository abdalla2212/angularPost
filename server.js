const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const dataPath = path.join(__dirname, 'db.json');

// Read data
function readData() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return { posts: [], deletedPosts: [] };
  }
}

// Save data
function saveData(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Routes
app.get('/posts', (req, res) => {
  const data = readData();
  res.json(data.posts);
});

app.get('/posts/:id', (req, res) => {
  const data = readData();
  const post = data.posts.find(p => p.id === req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

app.post('/posts', (req, res) => {
  const data = readData();
  const newPost = {
    ...req.body,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    isLiked: false,
    comments: []
  };
  data.posts.push(newPost);
  saveData(data);
  res.status(201).json(newPost);
});

app.put('/posts/:id', (req, res) => {
  const data = readData();
  const index = data.posts.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    data.posts[index] = { ...data.posts[index], ...req.body };
    saveData(data);
    res.json(data.posts[index]);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

app.delete('/posts/:id', (req, res) => {
  const data = readData();
  const index = data.posts.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    data.posts.splice(index, 1);
    saveData(data);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// Get all deleted posts
app.get('/deletedPosts', (req, res) => {
  const data = readData();
  res.json(data.deletedPosts);
});

// Add to deleted posts
app.post('/deletedPosts', (req, res) => {
  const data = readData();
  data.deletedPosts.push(req.body);
  saveData(data);
  res.status(201).json(req.body);
});

// Delete from deleted posts
app.delete('/deletedPosts/:id', (req, res) => {
  const data = readData();
  const postIndex = data.deletedPosts.findIndex(p => p.id === req.params.id);
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Deleted post not found' });
  }
  const deletedPost = data.deletedPosts[postIndex];
  data.deletedPosts.splice(postIndex, 1);
  saveData(data);
  res.json(deletedPost);
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
