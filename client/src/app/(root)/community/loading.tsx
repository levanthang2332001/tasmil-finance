import React from "react";
import LoadingItem from "@/components/community/LoadingItem";

function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto pt-16">
      {[...Array(40)].map((_, index) => (
        <LoadingItem key={index} />
      ))}
    </div>
  );
}

export default Loading;
