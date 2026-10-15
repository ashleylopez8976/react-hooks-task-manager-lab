import React, { useRef, useState } from "react";
import TaskList from "./TaskList";

function SearchBar() {
  const [query, setQuery] = useState("");
  const searchInputRef = useRef(null);

  function handleSearch() {
    setQuery(searchInputRef.current.value);
  }

  return (
    <div>
      <input
        ref={searchInputRef}
        type="text"
        aria-label="Search tasks"
        placeholder="Search tasks..."
        onChange={handleSearch}
      />
      <TaskList query={query} />
    </div>
  );
}

export default SearchBar;