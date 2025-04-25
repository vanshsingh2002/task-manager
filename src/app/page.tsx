"use client";

import TasksTable from "@/components/TaskTable";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <div className="flex justify-between items-center">
        <img src="/logo.png" alt="Logo" className="h-24 hidden md:block" />
        <div className="relative mr-0 p-5 w-full md:p-0 md:w-1/4 md:mr-6">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 pl-10 border border-[#9B9B9B] rounded-lg w-full focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 md:transform-none  md:left-3 md:top-5 h-5 w-5 text-[#9B9B9B]" />
        </div>
      </div>
      <TasksTable searchQuery={searchQuery} />
    </div>
  );
}
