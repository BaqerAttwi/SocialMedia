
const bodyParser = require('body-parser');
const BadWords = require('bad-words');

const app = express();
const port = process.env.PORT || 3000;
const badWordsFilter = new BadWords();

app.use(bodyParser.json());

// API endpoint for text analysis
app.post('/analyze-text', (req, res) => {
  const { text } = req.body;

  // Check if text contains bad words
  const hasBadWords = badWordsFilter.isProfane(text);

  // Determine if text is inappropriate (e.g., contains bad words)
  const isAppropriate = !hasBadWords;

  res.json({ isAppropriate });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
