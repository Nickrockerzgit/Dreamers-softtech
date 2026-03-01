import { useEffect, useRef } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rohit Verma",
    company: "TechStart Solutions",
    role: "CEO",
    avatar: "RV",
    color: "#C89A3D",
    rating: 5,
    text: "Dreamers Softtech delivered exceptional results. Their team understood our vision and transformed it into a powerful digital solution. Highly recommended!",
  },
  {
    name: "Anjali Mehta",
    company: "E-Commerce Pro",
    role: "Founder",
    avatar: "AM",
    color: "#4F8EF7",
    rating: 5,
    text: "Outstanding work! They built our e-commerce platform from scratch and it exceeded all expectations. Professional, timely, and innovative.",
  },
  {
    name: "Karan Desai",
    company: "HealthCare Plus",
    role: "Product Manager",
    avatar: "KD",
    color: "#2DBD8E",
    rating: 5,
    text: "The mobile app they developed has transformed our patient engagement. Their attention to detail and commitment to quality is unmatched.",
  },
  {
    name: "Neha Kapoor",
    company: "FinTech Innovations",
    role: "CTO",
    avatar: "NK",
    color: "#E45C7C",
    rating: 5,
    text: "Working with Dreamers Softtech was a game-changer for us. Their technical expertise and problem-solving abilities are top-notch.",
  },
  {
    name: "Siddharth Rao",
    company: "Digital Marketing Hub",
    role: "Director",
    avatar: "SR",
    color: "#9B6FE4",
    rating: 5,
    text: "They delivered our project on time and within budget. The team was responsive, skilled, and a pleasure to work with throughout.",
  },
  {
    name: "Priya Singh",
    company: "CloudBase Inc.",
    role: "VP Engineering",
    avatar: "PS",
    color: "#F4922A",
    rating: 5,
    text: "Incredible attention to detail. The team went above and beyond to ensure every feature worked flawlessly. Truly a world-class development partner.",
  },
  {
    name: "Amit Joshi",
    company: "RetailNow",
    role: "Co-Founder",
    avatar: "AJ",
    color: "#3ABDE0",
    rating: 5,
    text: "From ideation to launch, Dreamers Softtech guided us perfectly. The product quality speaks for itself — our users love every part of it.",
  },
  {
    name: "Divya Nair",
    company: "EduTech Global",
    role: "Head of Product",
    avatar: "DN",
    color: "#C89A3D",
    rating: 5,
    text: "Super collaborative team! They listened carefully, iterated fast, and shipped a polished product ahead of schedule. 10/10 experience.",
  },
  {
    name: "Vikram Bose",
    company: "LogiFlow",
    role: "CTO",
    avatar: "VB",
    color: "#E45C7C",
    rating: 5,
    text: "Their technical depth is impressive. Complex backend architecture delivered cleanly, on time, and exactly as scoped. Stellar work.",
  },
  {
    name: "Meera Pillai",
    company: "GreenTech Labs",
    role: "CEO",
    avatar: "MP",
    color: "#2DBD8E",
    rating: 5,
    text: "We needed a partner who could move fast without breaking things. Dreamers Softtech nailed it every single sprint.",
  },
];

// Distribute cards across 5 columns with enough repetition for seamless loop
const NUM_COLS = 5;
const getColumn = (colIdx: number) => {
  const col = testimonials.filter((_, i) => i % NUM_COLS === colIdx);
  // Repeat enough times to always fill viewport height
  return [...col, ...col, ...col, ...col, ...col, ...col];
};

const NORMAL_SPEED = 0.4;
const HOVER_SPEED = 0;

const ChatBubbleCard = ({ item }: { item: (typeof testimonials)[0] }) => (
  <div className="mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
    {/* Stars */}
    <div className="flex gap-0.5 mb-2">
      {Array.from({ length: item.rating }).map((_, i) => (
        <Star key={i} className="w-3 h-3 fill-[#C89A3D] text-[#C89A3D]" />
      ))}
    </div>

    {/* Text */}
    <p className="text-gray-600 text-xs leading-relaxed mb-3">"{item.text}"</p>

    {/* Author */}
    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
        style={{ backgroundColor: item.color }}
      >
        {item.avatar}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-800 leading-none">
          {item.name}
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">
          {item.role}, {item.company}
        </p>
      </div>
    </div>
  </div>
);

const Column = ({
  colIdx,
  direction,
}: {
  colIdx: number;
  direction: "up" | "down";
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const currentSpeedRef = useRef(NORMAL_SPEED);
  const hoveredRef = useRef(false);
  const rafRef = useRef<number>(0);

  const cards = getColumn(colIdx);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Start down columns at half so they feel naturally offset from up columns
    if (direction === "down") posRef.current = track.scrollHeight / 4;

    const animate = () => {
      const target = hoveredRef.current ? HOVER_SPEED : NORMAL_SPEED;
      // Lerp toward target speed for smooth decel/accel
      currentSpeedRef.current += (target - currentSpeedRef.current) * 0.06;

      const halfHeight = track.scrollHeight / 2;

      if (direction === "up") {
        posRef.current += currentSpeedRef.current;
        // Reset exactly at half — seamless because second half is identical to first
        if (posRef.current >= halfHeight) {
          posRef.current = posRef.current - halfHeight;
        }
        track.style.transform = `translateY(-${posRef.current}px)`;
      } else {
        posRef.current += currentSpeedRef.current;
        if (posRef.current >= halfHeight) {
          posRef.current = posRef.current - halfHeight;
        }
        // For down direction, start from halfway and go backwards
        track.style.transform = `translateY(-${halfHeight - posRef.current}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [direction]);

  return (
    <div
      className="flex-1 overflow-hidden relative"
      style={{ height: "600px" }}
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
    >
      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #f9fafb, transparent)",
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, #f9fafb, transparent)" }}
      />

      <div
        ref={trackRef}
        className="px-1.5"
        style={{ willChange: "transform" }}
      >
        {cards.map((item, idx) => (
          <ChatBubbleCard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};

const Testimonials = () => {
  // Alternating: up, down, up, down, up
  const directions: ("up" | "down")[] = ["up", "down", "up", "down", "up"];

  return (
    <section id="testimonials" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#C89A3D]" />
            <span className="text-xs uppercase tracking-widest text-[#C89A3D] font-semibold">
              Testimonials
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              What Our <span className="text-[#C89A3D]">Clients Say</span>
            </h2>
            <p className="text-gray-500 max-w-md text-sm leading-relaxed">
              Proven success stories from businesses we've helped grow with
              innovative digital solutions.
            </p>
          </div>
        </div>

        {/* 5 Columns */}
        <div className="flex gap-4">
          {directions.map((dir, colIdx) => (
            <Column key={colIdx} colIdx={colIdx} direction={dir} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
