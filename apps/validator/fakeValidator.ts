import express from 'express';
import axios from 'axios';

const app = express();
const port = 3001;

// Optional: just for browser check
app.get('/', (req, res) => {
  res.send('Fake Validator is running!');
});

// Simulated list of sites to validate
const sites = [
  'https://www.instagram.com',
  // Add more stored site URLs here
];

// This will simulate validator visiting each site every 60 seconds
setInterval(() => {
  sites.forEach(async (site) => {
    try {
      const response = await axios.get(site);
      console.log(`✅ Visited ${site}: Status ${response.status}`);
    } catch (error: any) {
      console.error(`❌ Error visiting ${site}:`, error.message);
    }
  });
}, 6000); // 60 seconds

// Start server
app.listen(port, () => {
  console.log(`Fake Validator is running on http://localhost:${port}`);
});
