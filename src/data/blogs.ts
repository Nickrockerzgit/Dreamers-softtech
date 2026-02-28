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
];
