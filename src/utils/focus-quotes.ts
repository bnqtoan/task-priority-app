import { FocusQuote } from '../utils/types';

export const FOCUS_QUOTES: FocusQuote[] = [
  {
    text: "The successful warrior is the average man with laser-like focus.",
    author: "Bruce Lee"
  },
  {
    text: "Concentration is the secret of strength.",
    author: "Ralph Waldo Emerson"
  },
  {
    text: "Focus is a matter of deciding what things you're not going to do.",
    author: "John Carmack"
  },
  {
    text: "The art of being wise is knowing what to overlook.",
    author: "William James"
  },
  {
    text: "Where attention goes, energy flows and results show.",
    author: "T. Harv Eker"
  },
  {
    text: "You can do two things at once, but you can't focus effectively on two things at once.",
    author: "Gary Keller"
  },
  {
    text: "The shorter way to do many things is to only do one thing at a time.",
    author: "Mozart"
  },
  {
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle"
  },
  {
    text: "Most people have no idea of the giant capacity we can immediately command when we focus all of our resources on mastering a single area of our lives.",
    author: "Tony Robbins"
  },
  {
    text: "The key to success is to focus our conscious mind on things we desire not things we fear.",
    author: "Brian Tracy"
  },
  {
    text: "Starve your distractions, feed your focus.",
    author: "Anonymous"
  },
  {
    text: "What we focus on expands.",
    author: "T. Harv Eker"
  },
  {
    text: "Lack of direction, not lack of time, is the problem. We all have twenty-four hour days.",
    author: "Zig Ziglar"
  },
  {
    text: "The main thing is to keep the main thing the main thing.",
    author: "Stephen Covey"
  },
  {
    text: "Focus is not just about what you concentrate on, but what you choose to ignore.",
    author: "Anonymous"
  },
  {
    text: "Your future is created by what you do today, not tomorrow.",
    author: "Anonymous"
  },
  {
    text: "Energy flows where attention goes.",
    author: "Michael Beckwith"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    text: "Don't be busy, be productive.",
    author: "Anonymous"
  }
];

export function getRandomFocusQuote(): FocusQuote {
  const randomIndex = Math.floor(Math.random() * FOCUS_QUOTES.length);
  return FOCUS_QUOTES[randomIndex];
}

export function getFocusQuoteByIndex(index: number): FocusQuote {
  return FOCUS_QUOTES[index % FOCUS_QUOTES.length];
}
