import { Router } from 'express';

const router = Router();

const specials = [
  { name: 'Chole Chawal', description: 'Loved and served food all across India.' },
  { name: 'Biriyani', description: 'Big-heartedness mixed with flavourful biryani.' },
  { name: 'Poori Sabji', description: 'Splendid Poori Sabji for breakfast.' },
  { name: 'Dal Rice', description: "Of course you can't enjoy lunch without dal rice!" },
  { name: 'South Indian', description: "Idli Sambhar and Dosa is perfect nutritious meal for anyone." },
  { name: 'Khichdi', description: "Most Donated food in Donation drives." }
];

router.get('/specials', (req, res) => {
  res.json(specials);
});

export default router;