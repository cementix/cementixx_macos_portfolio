import { locations } from "#constants";
import useLocationStore from "#store/location";
import useWindowStore from "#store/window";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useRef } from "react";

const projects = locations.work?.children ?? [];

const Home = () => {
  const homeRef = useRef(null);
  const { openWindow } = useWindowStore();
  const { setActiveLocation } = useLocationStore();

  const handleOpenProjectFinder = (project) => {
    setActiveLocation(project);
    openWindow("finder");
  };

  useGSAP(() => {
    if (!homeRef.current) return;

    const folders = homeRef.current.querySelectorAll(".folder");

    gsap.fromTo(
      folders,
      { y: 40, opacity: 0, scale: 0.85 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.45,
      }
    );
  }, []);

  useGSAP(() => {
    Draggable.create(".folder", {
      cursor: "pointer",
      activeCursor: "grab",
    });
  }, []);
  return (
    <section id="home" ref={homeRef}>
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            className={clsx("group folder", project.windowPosition)}
            onClick={() => handleOpenProjectFinder(project)}
          >
            <img src="/images/folder.png" alt={project.name} />
            <p
              style={{
                textShadow: "0 10px 8px rgba(0,0,0,0.55)",
              }}
            >
              {project.name}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Home;
