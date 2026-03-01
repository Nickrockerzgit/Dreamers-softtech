export interface Blog {
  id: string;
  title: string;
  category: string;
  author: string;
  readTime: string;
  date: string;
  image: string;
  imageSmall: string;
  excerpt: string;
  content: string;
}

import blogSm1 from "../assets/blogs/blogsSm2.png";
import blogSm2 from "../assets/blogs/blogsSm1.png";

import blog1 from "../assets/serv2.png";
import blog2 from "../assets/serv1.png";

export const blogs: Blog[] = [
  {
    id: "why-manual-billing-hurts-profits",
    title: "Why Manual Billing Hurts Restaurant Profits",
    category: "Business",
    author: "Ravi Kumar",
    readTime: "15 min read",
    date: "Feb 1, 2026",
    image: blog1,
    imageSmall: blogSm1,
    excerpt:
      "Manual billing systems slow down operations and reduce overall profit margins.",
    content: `
      <h2>Introduction</h2>
      <p>Manual billing creates inefficiencies...</p>
      <h2>Hidden Costs</h2>
      <p>Time delays, human errors, reporting gaps...</p>
    `,
  },
  {
    id: "restaurant-inventory-best-practices",
    title: "Restaurant Inventory Management Best Practices",
    category: "Business",
    author: "Ravi Kumar",
    readTime: "12 min read",
    date: "Feb 5, 2026",
    image: blog2,
    imageSmall: blogSm2,
    excerpt:
      "Inventory optimization is critical for profitability in food businesses.",
    content: `
      <h2>Why Inventory Matters</h2>
      <p>Food wastage directly impacts revenue...</p>
    `,
  },
  {
    id: "why-manual-billing-hurts-profits",
    title: "Why Manual Billing Hurts Restaurant Profits",
    category: "Business",
    author: "Ravi Kumar",
    readTime: "15 min read",
    date: "Feb 1, 2026",
    image: blog1,
    imageSmall: blogSm1,
    excerpt:
      "Manual billing systems slow down operations and reduce overall profit margins.",
    content: `
      <h2>Introduction</h2>
      <p>Manual billing creates inefficiencies...</p>
      <h2>Hidden Costs</h2>
      <p>Time delays, human errors, reporting gaps...</p>
    `,
  },
  {
    id: "restaurant-inventory-best-practices",
    title: "Restaurant Inventory Management Best Practices",
    category: "Business",
    author: "Ravi Kumar",
    readTime: "12 min read",
    date: "Feb 5, 2026",
    image: blog2,
    imageSmall: blogSm2,
    excerpt:
      "Inventory optimization is critical for profitability in food businesses.",
    content: `
      <h2>Why Inventory Matters</h2>
      <p>Food wastage directly impacts revenue...</p>
    `,
  },
  {
    id: "ai-in-healthcare-2026",
    title: "AI in Healthcare: Trends & Predictions",
    category: "Technology",
    author: "Anita Sharma",
    readTime: "10 min read",
    date: "Mar 10, 2026",
    image: blog1,
    imageSmall: blogSm1,
    excerpt:
      "Artificial intelligence is transforming diagnostics, treatment, and patient care.",
    content: `
      <h2>AI Applications</h2>
      <p>From predictive analytics to personalized medicine...</p>
    `,
  },
  {
    id: "mental-health-tips-for-students",
    title: "Mental Health Tips for Students",
    category: "Health",
    author: "Dr. Suresh Patel",
    readTime: "8 min read",
    date: "Jan 20, 2026",
    image: blog2,
    imageSmall: blogSm2,
    excerpt:
      "Managing stress and anxiety is crucial for academic success and overall well-being.",
    content: `
      <h2>Stress Management</h2>
      <p>Effective techniques to reduce stress include...</p>
    `,
  },
  {
    id: "online-learning-best-practices",
    title: "Online Learning Best Practices",
    category: "Education",
    author: "Priya Verma",
    readTime: "9 min read",
    date: "Feb 15, 2026",
    image: blog1,
    imageSmall: blogSm1,
    excerpt:
      "Maximize your learning with effective strategies for remote education.",
    content: `
      <h2>Focus & Motivation</h2>
      <p>Tips to stay focused while learning online...</p>
    `,
  },
  {
    id: "top-travel-destinations-2026",
    title: "Top Travel Destinations for 2026",
    category: "Travel",
    author: "Ravi Kumar",
    readTime: "12 min read",
    date: "Jan 30, 2026",
    image: blog2,
    imageSmall: blogSm2,
    excerpt:
      "Discover the must-visit locations around the world for your next vacation.",
    content: `
      <h2>Adventure & Culture</h2>
      <p>From hiking trails to local festivals...</p>
    `,
  },
  {
    id: "blockchain-for-business",
    title: "Blockchain Applications for Modern Business",
    category: "Technology",
    author: "Anita Sharma",
    readTime: "11 min read",
    date: "Mar 1, 2026",
    image: blog1,
    imageSmall: blogSm1,
    excerpt:
      "Blockchain is revolutionizing supply chains, payments, and data security.",
    content: `
      <h2>Business Use Cases</h2>
      <p>Smart contracts, decentralized finance, and more...</p>
    `,
  },
  {
    id: "nutrition-tips-for-healthy-living",
    title: "Nutrition Tips for Healthy Living",
    category: "Health",
    author: "Dr. Suresh Patel",
    readTime: "7 min read",
    date: "Feb 28, 2026",
    image: blog2,
    imageSmall: blogSm2,
    excerpt:
      "Eat smarter and boost your energy with these evidence-based nutrition tips.",
    content: `
      <h2>Balanced Diet</h2>
      <p>Include proteins, carbs, fats, and micronutrients in right proportions...</p>
    `,
  },
  {
    id: "future-of-ai-in-education",
    title: "The Future of AI in Education",
    category: "Education",
    author: "Priya Verma",
    readTime: "10 min read",
    date: "Mar 5, 2026",
    image: blog1,
    imageSmall: blogSm1,
    excerpt:
      "AI can personalize learning, automate grading, and improve student engagement.",
    content: `
      <h2>AI Tools</h2>
      <p>Examples include adaptive learning platforms and automated feedback systems...</p>
    `,
  },
];
