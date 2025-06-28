"use client";

import { useMemo, useState } from "react";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";
import { availableTags, mockTokenData } from "./constant";
import { getSortableValue, getSortIcon } from "./helpers";
import { TokenTableRow } from "./TokenTableRow";

interface SortConfig {
  field: "rank" | "name" | "price" | "age" | "change1h" | "change6h" | "change24h" | "volume24h" | "txns24h" | "marketCap" | "liquidity" | "makers24h";
  direction: "asc" | "desc";
}

interface TableColumn {
  key: SortConfig["field"];
  label: string;
  align: "left" | "right";
  sortable: boolean;
}

const TABLE_COLUMNS: TableColumn[] = [
  { key: "rank", label: "#", align: "left", sortable: true },
  { key: "name", label: "Name", align: "left", sortable: true },
  { key: "price", label: "Price", align: "right", sortable: true },
  { key: "age", label: "Age", align: "right", sortable: true },
  { key: "change1h", label: "1h", align: "right", sortable: true },
  { key: "change6h", label: "6h", align: "right", sortable: true },
  { key: "change24h", label: "24h", align: "right", sortable: true },
  { key: "volume24h", label: "24h Volume", align: "right", sortable: true },
  { key: "txns24h", label: "24h Txns", align: "right", sortable: true },
  { key: "marketCap", label: "Market Cap", align: "right", sortable: true },
  { key: "liquidity", label: "Liquidity", align: "right", sortable: false },
  { key: "makers24h", label: "24h Makers", align: "right", sortable: false },
];

function SpotLight() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "rank",
    direction: "asc",
  });

  const filteredAndSortedTokens = useMemo(() => {
    const tokens = selectedTag
      ? mockTokenData.filter((token) => token.tags?.includes(selectedTag))
      : mockTokenData;

    return tokens.sort((a, b) => {
      const aValue = getSortableValue(a, sortConfig.field);
      const bValue = getSortableValue(b, sortConfig.field);

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      const comparison = (aValue as number) - (bValue as number);
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [selectedTag, sortConfig]);

  function handleSort(field: SortConfig["field"]) {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

  function renderTableHeader() {
    return (
      <thead>
        <tr className="border-b border-gray-700">
          {TABLE_COLUMNS.map((column) => (
            <th
              key={column.key}
              className={`py-3 px-2 text-sm font-medium text-gray-400 ${
                column.align === "right" ? "text-right" : "text-left"
              } ${
                column.sortable
                  ? "cursor-pointer hover:text-gray-300 transition-colors"
                  : ""
              }`}
              onClick={column.sortable ? () => handleSort(column.key) : undefined}
            >
              <div
                className={`flex items-center gap-1 ${
                  column.align === "right" ? "justify-end" : ""
                }`}
              >
                {column.label}
                {column.sortable && getSortIcon(column.key, sortConfig.field, sortConfig.direction)}
              </div>
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  function renderTableBody() {
    if (isLoading) {
      return (
        <tbody>
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="border-b border-gray-800">
              <td className="py-3 px-2" colSpan={TABLE_COLUMNS.length}>
                <Skeleton className="h-12 w-full" />
              </td>
            </tr>
          ))}
        </tbody>
      );
    }

    return (
      <tbody>
        {filteredAndSortedTokens.map((token) => (
          <TokenTableRow key={token.rank} token={token} sortField={sortConfig.field} />
        ))}
      </tbody>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={selectedTag === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedTag(null)}
          className="h-8"
        >
          All
        </Button>
        {availableTags.map((tag) => (
          <Button
            key={tag}
            variant={selectedTag === tag ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(tag)}
            className="h-8 capitalize"
          >
            {tag}
          </Button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse">
          {renderTableHeader()}
          {renderTableBody()}
        </table>
      </div>

      {!isLoading && filteredAndSortedTokens.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No tokens found with the selected filter.
        </div>
      )}
    </div>
  );
}

export default SpotLight;
