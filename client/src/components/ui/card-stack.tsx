"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

let interval: NodeJS.Timeout;

type Card = {
  thumbnail: string;
  title: string;
  description: string;
  owner: string;
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  useEffect(() => {
    startFlipping();
    return () => clearInterval(interval);
  }, []);

  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop()!); // Move the last element to the front
        return newArray;
      });
    }, 5000);
  };

  return (
    <div className="relative h-60 w-60 md:h-80 md:w-96">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={index}
            className="absolute dark:bg-black bg-white h-60 w-60 md:h-60 md:w-72 rounded-3xl  shadow-xl border border-slate-200 dark:border-white/[0.1] shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col justify-between"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR,
              zIndex: cards.length - index,
            }}
          >
            <div className="w-full  h-auto  bg-base-100 rounded-2xl  overflow-hidden">
              <figure>
                <img
                  src={card.thumbnail}
                  alt={card.title || "Thumbnail"}
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </figure>
              <div className="px-2">
                <h2 className="font-semibold text-lg md:text-xl text-black">{card.title}</h2>
                <p className="text-neutral-500 md:text-base text-sm ">View All Playlist</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
