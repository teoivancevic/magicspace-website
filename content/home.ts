// All copy for the home page lives here. Edit text freely without touching components.

export const hero = {
  title: ["follow your curiosity,", "be more human"],
  // TODO: replace with the final subline
  subline: "your ai pocket for the internet",
};

export const manifesto = {
  id: "manifesto",
  // Wrap one paragraph in ** to render it as the larger pull line.
  paragraphs: [
    "i have 12,000 screenshots.",
    "a song a friend played me. an interview i meant to finish. a painting i wanted to see in person. a recipe, a jacket, a book, a city.",
    "every thing i saved was a small spark of curiosity. and almost all of them died right there, because the next reel was always easier.",
    "**every abandoned curiosity is a little seed of a person we could’ve been.**",
    "magicspace is where those seeds go to grow. you save something the way you already do. it finds where it came from, figures out what you wanted, and helps you actually follow it. over time, it shows you the threads you keep coming back to.",
    "what you’re curious about is some of the most personal data you have. so it stays yours. no ads, no selling it, no training ai on it. we read each screenshot once and never keep it.",
    "not to make you more productive. to make you a little more yourself than the day before.",
  ],
  signoff: "— teo",
  // optional avatar; the component skips it if the file does not exist in /public
  avatar: "/teo.jpg",
};

export type FaqItem = { question: string; answer: string };

export const faq = {
  id: "faq",
  heading: "questions",
  // Answers may contain markdown-style links: [label](https://...) or [label](mailto:...)
  items: [
    {
      question: "what is magicspace?",
      answer:
        "an iphone app for everything you’re curious about. screenshot something, and magicspace finds where it came from, works out what you wanted to do with it, and helps you do it.",
    },
    {
      question: "do you sell my data or train ai on it?",
      answer:
        "no. no ads, and we never sell your data. your saves aren’t used to train ai, ours or anyone else’s. we’ll make money from a paid plan, not from you. you’re the customer, not the product.",
    },
    {
      question: "what happens to my screenshots?",
      answer:
        "they stay on your phone. we never store them. an ai reads each one once to pull out the title, the source and what to do next, and that’s all we keep. delete a save, and it’s gone from our servers too.",
    },
    {
      question: "isn’t this just another save-for-later app?",
      answer:
        "most save apps are to-do lists for the internet. magicspace is more interested in why you saved something than whether you checked it off. it’s built to help you notice what you keep coming back to, and follow it.",
    },
    {
      question: "what’s the username for?",
      answer:
        "your name in magicspace. soon you’ll be able to share what you’re into with friends, so grab the one you want before someone else does.",
    },
    {
      question: "when can i use it?",
      answer: "we’re testing with a small group now. join the waitlist and we’ll let people in in small batches.",
    },
    {
      question: "who’s making this?",
      answer:
        "me, teo. i’m a student in new york, and this started with my own 12,000 screenshots. if you want to talk, [message me](mailto:ti@teoivancevic.com), i reply to everyone.",
    },
  ] satisfies FaqItem[],
};

export const closing = {
  id: "closing",
  line: "what are you curious about?",
};
