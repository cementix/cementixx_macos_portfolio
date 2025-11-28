import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const FONT_WEIGHTS = {
  subtitle: { min: 100, max: 400, default: 300 },
  title: { min: 400, max: 900, default: 500 },
};

const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <span
      key={i}
      className={className}
      style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

const setupTextHover = (container, type) => {
  if (!container) return () => {};

  const letters = container.querySelectorAll("span");
  const { min, max, default: base } = FONT_WEIGHTS[type];

  const animateLetter = (letter, weight, duration = 0.25) => {
    return gsap.to(letter, {
      duration,
      ease: "power2.out",
      fontVariationSettings: `'wght' ${weight}`,
    });
  };

  const handleMouseMove = (e) => {
    const { left } = container.getBoundingClientRect();
    const mouseX = e.clientX - left;

    letters.forEach((letter) => {
      const { left: l, width: w } = letter.getBoundingClientRect();
      const distance = Math.abs(mouseX - (l - left + w / 2));
      const intensity = Math.exp(-(distance ** 2) / 15000);

      animateLetter(letter, min + (max - min + 100) * intensity);
    });
  };

  const handleMouseLeave = () => {
    letters.forEach((letter) => animateLetter(letter, base, 0.3));
  };

  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseleave", handleMouseLeave);
  };
};

const Welcome = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const sectionRef = useRef(null);

  useGSAP(() => {
    const titleCleanup = setupTextHover(titleRef.current, "title");
    const subtitleCleanup = setupTextHover(subtitleRef.current, "subtitle");

    return () => {
      subtitleCleanup();
      titleCleanup();
    };
  }, []);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const titleLetters = titleRef.current
      ? titleRef.current.querySelectorAll("span")
      : [];
    const subtitleLetters = subtitleRef.current
      ? subtitleRef.current.querySelectorAll("span")
      : [];

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (typeof document !== "undefined") {
      tl.fromTo(
        document.body,
        { backgroundSize: "115%" },
        { backgroundSize: "cover", duration: 1.4, ease: "power2.out" },
        0
      );
    }

    tl.fromTo(
      section,
      { opacity: 0, backgroundPosition: "center 80%" },
      {
        opacity: 1,
        backgroundPosition: "center calc(50% - 140px)",
        duration: 1.2,
      }
    )
      .fromTo(
        subtitleLetters,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.02 },
        "-=0.7"
      )
      .fromTo(
        titleLetters,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.03 },
        "-=0.4"
      );
  }, []);

  return (
    <section
      id="welcome"
      ref={sectionRef}
      className="relative"
      style={{
        backgroundPosition: "center calc(50% - 140px)",
      }}
    >
      <p
        ref={subtitleRef}
        className="relative z-10 -mt-36"
        style={{
          color: "#f5f5f5",
          fontWeight: 400,
          textShadow: "0 3px 8px rgba(0,0,0,0.55)",
        }}
      >
        {renderText(
          "Hey, I'm Bohdan! Welcome to my",
          "text-3xl font-georama",
          350
        )}
      </p>

      <h1
        ref={titleRef}
        className="relative z-10 mt-6"
        style={{
          color: "#ffffff",
          textShadow: "0 6px 16px rgba(0,0,0,0.75)",
        }}
      >
        {renderText(
          "portfolio",
          "text-[9rem] italic font-georama leading-[0.8]"
        )}
      </h1>

      <div className="small-screen">
        <p>This Portfolio is designed for desktop/tabled screens only.</p>
      </div>
    </section>
  );
};

export default Welcome;
