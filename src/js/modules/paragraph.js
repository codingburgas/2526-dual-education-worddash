import paragraphs from '../data/paragraphs.js';
import quotes     from '../data/quotes.js';
import { en as wordsEn, bg as wordsBg } from '../data/words.js';

const pool = { en: wordsEn, bg: wordsBg };
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Returns typing content: random words for 'words' mode, a filtered quote for 'quote', or a difficulty-filtered paragraph otherwise
export const getContent = (mode, options = {}, lang = 'en') => {
  const { difficulty = 'mixed', length = 'mixed', count = 25 } = options;

  if (mode === 'words') {
    const words = pool[lang] || pool.en;
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(words[Math.floor(Math.random() * words.length)]);
    }
    return result.join(' ');
  }

  if (mode === 'quote') {
    let filtered = quotes;
    if (length !== 'mixed') filtered = quotes.filter((q) => q.length === length);
    if (!filtered.length) filtered = quotes;
    const entry = rand(filtered);
    return entry[lang] || entry.en;
  }

  let filtered = paragraphs;
  if (difficulty !== 'mixed') {
    filtered = paragraphs.filter((p) => p.difficulty === difficulty);
  }
  if (!filtered.length) filtered = paragraphs;
  const entry = rand(filtered);
  return entry[lang] || entry.en;
};
