'use client';

import React, { useEffect, useState } from 'react';
import reorderList from '~/components/ui/reorderList'; // Adjust import path as needed

export default function SortListPage() {
  const [items, setItems] = useState<string[]>([
    "You asked if",
    "you could see me",
    "before I went to",
    "Spain, you didn't",
    "give a reason didn't",
    "know what you would",
    "say. But I was hoping",
    "that my breath on your",
    "face would blow every",
    "last thing into place"
  ]);

  const [dragged, setDragged] = useState<number | null>(null);
  const [mouse, setMouse] = useState<[number, number]>([0, 0]);
  const [closestDropZone, setClosestDropZone] = useState(0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dragged !== null) {
        e.preventDefault();
        setDragged(null);
        setItems((items) => reorderList(items, dragged, closestDropZone));
      }
    };

    document.addEventListener('mouseup', handler);
    return () => document.removeEventListener('mouseup', handler);
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMouse([e.x, e.y]);
    };

    document.addEventListener('mousemove', handler);
    return () => document.removeEventListener('mousemove', handler);
  }, []);

  useEffect(() => {
    if (dragged !== null) {
      const elements = Array.from(document.getElementsByClassName('drop-zone'));
      const positions = elements.map((e) => e.getBoundingClientRect().top);
      const absDifferences = positions.map((v) => Math.abs(v - mouse[1]));
      let result = absDifferences.indexOf(Math.min(...absDifferences));

      if (result > dragged) result += 1;

      setClosestDropZone(result);
    }
  }, [dragged, mouse]);

  return (
    <>
      {dragged !== null && (
        <div
          className="floating list-item"
          style={{
            left: `${mouse[0]}px`,
            top: `${mouse[1]}px`,
          }}
        >
          <p>{items[dragged]}</p>
        </div>
      )}
      <div className="list">
        <div
          key={`0-drop-zone-a`}
          className={`list-item drop-zone ${
            dragged === null || closestDropZone !== 0 ? 'hidden' : ''
          }`}
        />
        {items.map((v, i) => (
          <React.Fragment key={v}>
            {dragged !== i && (
              <>
                <div
                  className="list-item"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setDragged(i);
                    setClosestDropZone(i);
                  }}
                >
                  <p>{v}</p>
                </div>

                <div
                  className={`list-item drop-zone ${
                    dragged === null || closestDropZone !== i + 1 ? 'hidden' : ''
                  }`}
                  onMouseUp={(e) => {
                    e.preventDefault();
                    if (dragged !== null) {
                      setDragged(null);
                    }
                  }}
                ></div>
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}