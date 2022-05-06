import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { debounce } from "underscore";

function Draggable({ children, handleRef, onMove, x = 0, y = 0 }) {
  const dragRef = useRef(null);
  const initialX = useRef(0);
  const initialY = useRef(0);
  const [position, setPosition] = useState({ x, y });

  const Move = useMemo(() => debounce((x, y) => onMove(x, y), 500), [onMove]);
  const onMouseMove = useCallback(
    (e) => {
      setPosition({
        x: e.clientX - initialX.current,
        y: e.clientY - initialY.current,
      });
      Move(e.clientX - initialX.current, e.clientY - initialY.current);
    },
    [Move]
  );

  const removeEvents = useCallback(() => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", removeEvents);
    document.removeEventListener("mouseleave", removeEvents);
  }, [onMouseMove]);

  const onMouseDown = useCallback(
    (e) => {
      const { left, top } = dragRef.current.getBoundingClientRect();
      initialX.current = e.clientX - left;
      initialY.current = e.clientY - top;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", removeEvents);
      document.addEventListener("mouseleave", removeEvents);
    },
    [onMouseMove, removeEvents]
  );
  useEffect(() => {
    const handle = handleRef.current;
    handle.addEventListener("mousedown", onMouseDown);
    return () => {
      handle.removeEventListener("mousedown", onMouseDown);
      Move.cancel();
    };
  }, [onMouseDown, handleRef, Move]);
  return (
    <div
      ref={dragRef}
      className="absolute select-none"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      {children}
    </div>
  );
}

export default Draggable;
