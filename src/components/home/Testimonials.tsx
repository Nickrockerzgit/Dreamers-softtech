// src/components/home/Testimonials.tsx

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

// ─── DB type ──────────────────────────────────────────────────
interface DBTestimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  avatar: string | null;
  color: string;
  avatarImage: string | null;
  rating: number;
  text: string;
  status: string;
}

const NUM_COLS = 5;

const getColumn = (items: DBTestimonial[], colIdx: number) => {
  const col = items.filter((_, i) => i % NUM_COLS === colIdx);
  return [...col, ...col, ...col, ...col, ...col, ...col];
};

const NORMAL_SPEED = 0.4;
const HOVER_SPEED = 0;

// ─── Card ─────────────────────────────────────────────────────
const ChatBubbleCard = ({ item }: { item: DBTestimonial }) => (
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
      {item.avatarImage ? (
        <img
          src={item.avatarImage}
          alt={item.name}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-100"
        />
      ) : (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
          style={{ backgroundColor: item.color || "#C89A3D" }}
        >
          {item.avatar || item.name?.charAt(0)}
        </div>
      )}
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

// ─── Skeleton Card ────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
    <div className="flex gap-0.5 mb-3">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="w-3 h-3 rounded-sm bg-gray-200" />
      ))}
    </div>
    <div className="space-y-1.5 mb-3">
      <div className="h-2.5 bg-gray-100 rounded w-full" />
      <div className="h-2.5 bg-gray-100 rounded w-4/5" />
      <div className="h-2.5 bg-gray-100 rounded w-3/5" />
    </div>
    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="space-y-1">
        <div className="h-2.5 bg-gray-200 rounded w-20" />
        <div className="h-2 bg-gray-100 rounded w-28" />
      </div>
    </div>
  </div>
);

// ─── Column ───────────────────────────────────────────────────
const Column = ({
  items,
  colIdx,
  direction,
}: {
  items: DBTestimonial[];
  colIdx: number;
  direction: "up" | "down";
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const currentSpeedRef = useRef(NORMAL_SPEED);
  const hoveredRef = useRef(false);
  const rafRef = useRef<number>(0);

  const cards = getColumn(items, colIdx);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || cards.length === 0) return;

    if (direction === "down") posRef.current = track.scrollHeight / 4;

    const animate = () => {
      const target = hoveredRef.current ? HOVER_SPEED : NORMAL_SPEED;
      currentSpeedRef.current += (target - currentSpeedRef.current) * 0.06;

      const halfHeight = track.scrollHeight / 2;

      if (direction === "up") {
        posRef.current += currentSpeedRef.current;
        if (posRef.current >= halfHeight) posRef.current -= halfHeight;
        track.style.transform = `translateY(-${posRef.current}px)`;
      } else {
        posRef.current += currentSpeedRef.current;
        if (posRef.current >= halfHeight) posRef.current -= halfHeight;
        track.style.transform = `translateY(-${halfHeight - posRef.current}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [direction, cards.length]);

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
      <div
        className="absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #f9fafb, transparent)",
        }}
      />
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

// ─── Skeleton Column ──────────────────────────────────────────
const SkeletonColumn = () => (
  <div className="flex-1 overflow-hidden relative" style={{ height: "600px" }}>
    {[0, 1, 2, 3].map((i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

// ─── Main Section ─────────────────────────────────────────────
const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<DBTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/testimonials`);
        const data = await res.json();
        if (res.ok) {
          setTestimonials(
            data.data.filter((t: DBTestimonial) => t.status === "published"),
          );
        }
      } catch {
        /* fail silently */
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

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

        {/* Columns */}
        <div className="flex gap-4">
          {loading
            ? [0, 1, 2, 3, 4].map((i) => <SkeletonColumn key={i} />)
            : directions.map((dir, colIdx) => (
                <Column
                  key={colIdx}
                  items={testimonials}
                  colIdx={colIdx}
                  direction={dir}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
