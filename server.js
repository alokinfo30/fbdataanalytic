const express = require('express');
const request = require('request');

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000
const facebookAppId = 'YOUR_FACEBOOK_APP_ID'; // Replace with your Facebook App ID
const facebookAppSecret = 'YOUR_FACEBOOK_APP_SECRET'; // Replace with your Facebook App Secret

function getFacebookData(url, callback) {
  const accessToken = `${facebookAppId}|${facebookAppSecret}`;
  request(`https://graph.facebook.com/?access_token=${accessToken}&fields=likes.limit(100),comments.limit(100)&id=${url}`, (error, response, body) => {
    if (error) {
      callback(error);
    } else {
      try {
        const data = JSON.parse(body);
        callback(null, data);
      } catch (error) {
        callback(error);
      }
    }
  });
}

app.get('/facebook-data/:url', (req, res) => {
  const url = req.params.url;
  getFacebookData(url, (error, data) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error fetching data');
    } else {
      const likesCount = data.likes?.summary?.total_count || 0;
      const commentsCount = data.comments?.summary?.total_count || 0;
      res.json({ likes: likesCount, comments: commentsCount });
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

