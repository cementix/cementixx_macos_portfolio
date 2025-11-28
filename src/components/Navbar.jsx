import { useGSAP } from "@gsap/react";
import dayjs from "dayjs";
import gsap from "gsap";
import { useRef } from "react";

import { navIcons, navLinks } from "#constants";
import useWindowStore from "#store/window";

const Navbar = () => {
  const navRef = useRef(null);
  const { openWindow } = useWindowStore();

  useGSAP(() => {
    if (!navRef.current) return;

    gsap.fromTo(
      navRef.current,
      { y: -60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.1,
      }
    );
  }, []);

  return (
    <nav ref={navRef}>
      <div>
        <img src="/images/logo.svg" alt="logo" />
        <p className="font-bold">Bohdan's Portfolio</p>

        <ul>
          {navLinks.map(({ id, name, type }) => (
            <li
              className="hover:underline cursor-pointer"
              key={id}
              onClick={() => openWindow(type)}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <ul>
          {navIcons.map(({ id, img }) => (
            <li key={id}>
              <img src={img} alt={`icon-${id}`} className="icon-hover" />
            </li>
          ))}
        </ul>
      </div>

      <time>{dayjs().format("ddd MMM D h:mm A")}</time>
    </nav>
  );
};

export default Navbar;
