"use client";

import React from "react";

const colors = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
];

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-4 bg-background text-foreground">
      <h1 className="text-2xl font-semibold mb-6">Tailwind Color Palette</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
        {colors.map((color) => (
          <div
            key={color}
            className="flex flex-col items-center justify-center p-4 rounded-lg shadow border"
            style={{
              backgroundColor: `hsl(var(--${color}))`,
              color: color.includes("foreground")
                ? "hsl(var(--background))"
                : "hsl(var(--foreground))",
              borderColor: "hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          >
            <p className="font-medium">{color}</p>
            <p className="text-sm opacity-75">{`hsl(var(--${color}))`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
