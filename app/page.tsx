"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner"

export default function HomePage() {
  return (
    <div className="flex flex-col text-center">
      <h1>h1 - Dra Geisa Garcia</h1>
      <h2>h2 - Dra Geisa Garcia</h2>
      <h3>h3 - Dra Geisa Garcia</h3>
      <h4>h4 - Dra Geisa Garcia</h4>
      <h5>h5 - Dra Geisa Garcia</h5>
      <h6>h6 - Dra Geisa Garcia</h6>
      <p>p - Dra Geisa Garcia</p>
      <small>small - Dra Geisa Garcia</small>
      <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Show Toast
    </Button>
    </div>
  );
}
