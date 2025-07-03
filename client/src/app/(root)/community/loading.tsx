import React from "react";
import LoadingItem from "@/components/community/LoadingItem";

function Loading() {
  return (
    <div className="max-w-2xl mx-auto">
      {[...Array(6)].map((_, index) => (
        <LoadingItem key={index} index={index} />
      ))}
    </div>
  );
}

export default Loading;
