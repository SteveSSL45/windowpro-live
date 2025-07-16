import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { Rnd } from "react-rnd";
import { FaTrash, FaUndo, FaRedo, FaClone, FaLayerGroup, FaExpand, FaSyncAlt } from "react-icons/fa";
import clay from "./images/window-clay.png";
import white from "./images/window-white.png";
import black from "./images/window-black.png";
import brown from "./images/window-brown.png";

const windowImages = [
  { src: white, label: "White" },
  { src: black, label: "Black" },
  { src: brown, label: "Brown" },
  { src: clay, label: "Clay" },
];

export default function Visualizer() {
  const [background, setBackground] = useState(null);
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const containerRef = useRef(null);

  const addWindow = (src) => {
    const newElement = {
      id: Date.now(),
      src,
      x: 50,
      y: 50,
      width: 160,
      height: 160,
      z: elements.length,
      rotation: 0
    };
    updateHistory([...elements, newElement]);
  };

  const updateHistory = (newElements) => {
    setHistory((h) => [...h, elements]);
    setElements(newElements);
    setFuture([]);
  };

  const handleBackgroundChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBackground(reader.result);
    reader.readAsDataURL(file);
  };

  const handleExport = () => {
    if (!containerRef.current) return;
    html2canvas(containerRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = "visualization.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setFuture([elements, ...future]);
    setElements(prev);
    setHistory(history.slice(0, -1));
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory([...history, elements]);
    setElements(next);
    setFuture(future.slice(1));
  };

  const bringForward = (id) => {
    const updated = elements.map((el) =>
      el.id === id ? { ...el, z: el.z + 1 } : el
    );
    updateHistory(updated);
  };

  const duplicateElement = (id) => {
    const element = elements.find((el) => el.id === id);
    if (!element) return;
    const copy = { ...element, id: Date.now(), x: element.x + 20, y: element.y + 20 };
    updateHistory([...elements, copy]);
  };

  const updateElement = (id, newProps) => {
    const updated = elements.map((el) =>
      el.id === id ? { ...el, ...newProps } : el
    );
    updateHistory(updated);
  };

  const removeElement = (id) => {
    updateHistory(elements.filter((el) => el.id !== id));
  };

  const handleFullScreen = () => {
    if (containerRef.current.requestFullscreen) {
      containerRef.current.requestFullscreen();
    }
  };

  const rotateElement = (id) => {
    const updated = elements.map((el) =>
      el.id === id ? { ...el, rotation: (el.rotation + 15) % 360 } : el
    );
    updateHistory(updated);
  };

  useEffect(() => {
    localStorage.setItem("savedDesign", JSON.stringify(elements));
  }, [elements]);

  useEffect(() => {
    const saved = localStorage.getItem("savedDesign");
    if (saved) {
      setElements(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <input type="file" onChange={handleBackgroundChange} accept="image/*" className="border rounded p-2" />
        {windowImages.map((img) => (
          <button
            key={img.label}
            onClick={() => addWindow(img.src)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            {img.label}
          </button>
        ))}
        <button onClick={handleUndo} className="px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded"><FaUndo /></button>
        <button onClick={handleRedo} className="px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded"><FaRedo /></button>
        <button onClick={handleExport} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded">Export</button>
        <button onClick={handleFullScreen} className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"><FaExpand /></button>
      </div>

      <div
        ref={containerRef}
        onClick={() => setSelectedId(null)}
        className="relative border-4 border-gray-300 w-full h-[80vh] bg-center bg-cover rounded-xl shadow-inner overflow-hidden"
        style={{ backgroundImage: `url(${background})` }}
      >
        {elements.map((el) => (
          <Rnd
            key={el.id}
            size={{ width: el.width, height: el.height }}
            position={{ x: el.x, y: el.y }}
            onDragStop={(e, d) => updateElement(el.id, { x: d.x, y: d.y })}
            onResizeStop={(e, dir, ref, delta, position) =>
              updateElement(el.id, {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                ...position,
              })
            }
            style={{ zIndex: el.z, transform: `rotate(${el.rotation}deg)` }}
            bounds="parent"
            className="absolute transition-all duration-100 ease-in-out"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedId(el.id);
            }}
            enableResizing={{
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true
            }}
          >
            <div className="w-full h-full relative pointer-events-none">
              <img
                src={el.src}
                alt="window"
                className="w-full h-full object-contain"
                draggable={false}
              />
              {selectedId === el.id && (
                <div className="absolute top-1 right-1 flex gap-1 pointer-events-auto">
                  <button onClick={() => removeElement(el.id)}><FaTrash className="text-red-500 hover:text-red-700" /></button>
                  <button onClick={() => duplicateElement(el.id)}><FaClone className="text-green-500 hover:text-green-700" /></button>
                  <button onClick={() => bringForward(el.id)}><FaLayerGroup className="text-blue-500 hover:text-blue-700" /></button>
                  <button onClick={() => rotateElement(el.id)}><FaSyncAlt className="text-purple-500 hover:text-purple-700" /></button>
                </div>
              )}
            </div>
          </Rnd>
        ))}
      </div>
    </div>
  );
}
