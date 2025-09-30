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
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Excellence is not a destination; it is a continuous journey that never ends.",
    author: "Brian Tracy"
  },
  {
    text: "The difference between ordinary and extraordinary is that little extra.",
    author: "Jimmy Johnson"
  },
  {
    text: "Quality is not an act, it is a habit.",
    author: "Aristotle"
  },
  {
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln"
  },
  {
    text: "Action is the foundational key to all success.",
    author: "Pablo Picasso"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "Focus on progress, not perfection.",
    author: "Anonymous"
  },
  {
    text: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma"
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "You are what you do, not what you say you'll do.",
    author: "Carl Jung"
  },
  {
    text: "Do one thing every day that scares you.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "Either you run the day, or the day runs you.",
    author: "Jim Rohn"
  },
  {
    text: "Nothing will work unless you do.",
    author: "Maya Angelou"
  },
  {
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe"
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Anonymous"
  },
  {
    text: "Dream bigger. Do bigger.",
    author: "Anonymous"
  },
  {
    text: "One day or day one. You decide.",
    author: "Anonymous"
  },
  {
    text: "Sometimes later becomes never. Do it now.",
    author: "Anonymous"
  },
  {
    text: "Little things make big days.",
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
