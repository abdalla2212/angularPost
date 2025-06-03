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

// In-memory database
let posts = [
  {
    id: '1',
    userName: 'John Doe',
    userImage: 'https://i.pravatar.cc/150?img=1',
    title: 'Amazing Sunset',
    postDescription: 'Beautiful sunset view from my balcony today. The colors are absolutely breathtaking!',
    postImage: 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
    createdAt: new Date().toISOString(),
    isLiked: false,
    comments: ['Great shot!', 'Beautiful colors!']
  },
  {
    id: '2',
    userName: 'Jane Smith',
    userImage: 'https://i.pravatar.cc/150?img=2',
    title: 'Mountain Adventure',
    postDescription: 'Just completed an amazing hiking trip in the mountains. The view from the top was worth every step!',
    postImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    createdAt: new Date().toISOString(),
    isLiked: true,
    comments: ['Looks amazing!', 'Which mountain is this?']
  }
];

// Routes
app.get('/posts', (req, res) => {
  res.json(posts);
});

app.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

app.post('/posts', (req, res) => {
  const newPost = {
    ...req.body,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    isLiked: false,
    comments: []
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

app.put('/posts/:id', (req, res) => {
  const index = posts.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...req.body };
    res.json(posts[index]);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

app.delete('/posts/:id', (req, res) => {
  const index = posts.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    posts.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// Get all deleted posts
app.get('/deletedPosts', (req, res) => {
  try {
    const data = readData();
    res.json(data.deletedPosts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error reading deleted posts' });
  }
});

// Add to deleted posts
app.post('/deletedPosts', (req, res) => {
  try {
    const data = readData();
    data.deletedPosts.push(req.body);
    saveData(data);
    res.status(201).json(req.body);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error saving deleted post' });
  }
});

// Delete from deleted posts
app.delete('/deletedPosts/:id', (req, res) => {
  try {
    const data = readData();
    const postIndex = data.deletedPosts.findIndex(p => p.id === req.params.id);
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Deleted post not found' });
    }
    const deletedPost = data.deletedPosts[postIndex];
    data.deletedPosts.splice(postIndex, 1);
    saveData(data);
    res.json(deletedPost);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error removing deleted post' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
