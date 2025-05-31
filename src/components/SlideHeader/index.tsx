"use client";

import { useState, useEffect, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./styles.module.scss";

const images = [
  "https://raw.githubusercontent.com/lamlinhh/Travel_Web/refs/heads/main/assets/Images/hoian.webp",
  "https://raw.githubusercontent.com/lamlinhh/Travel_Web/refs/heads/main/assets/Images/japan-tokyo_wpvxra.webp",
  "https://raw.githubusercontent.com/lamlinhh/Travel_Web/refs/heads/main/assets/Images/moscow_jr5bb4.webp",
  "https://raw.githubusercontent.com/lamlinhh/Travel_Web/refs/heads/main/assets/Images/sydney-opera-house-near-body-of-water-during-daytime-1_fbgqyc.webp",
];

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 5000); // 5s đổi ảnh

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transition =
        currentIndex === images.length + 1
          ? "none"
          : "transform 1s ease-in-out";
      sliderRef.current.style.transform = `translateX(-${currentIndex * 100}vw)`;
    }

    if (currentIndex === images.length + 1) {
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.style.transition = "none";
          sliderRef.current.style.transform = `translateX(-100vw)`;
        }
        setCurrentIndex(1);
      }, 1000);
    }
  }, [currentIndex]);

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper} ref={sliderRef}>
        <img src={images[images.length - 1]} alt="Last Clone" />{" "}
        {/* Clone ảnh cuối */}
        {images.map((src, index) => (
          <img key={index} src={src} alt={`Background ${index + 1}`} />
        ))}
        <img src={images[0]} alt="First Clone" /> {/* Clone ảnh đầu */}
      </div>

      <div className={styles.overlay}></div>
    </div>
  );
};

export default Index;
