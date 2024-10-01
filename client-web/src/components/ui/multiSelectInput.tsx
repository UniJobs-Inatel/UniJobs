import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";

export interface MultiSelectInputProps {
  label?: string;
  options: Array<{ value: string; label: string }>;
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  error?: string;
}

const MultiSelectInput = ({
  label,
  options,
  selectedOptions,
  onChange,
  error,
}: MultiSelectInputProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  const toggleOption = (value: string) => {
    if (selectedOptions.includes(value)) {
      onChange(selectedOptions.filter((option) => option !== value));
    } else {
      onChange([...selectedOptions, value]);
    }
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mouseup", handleClickOutside);
    document.addEventListener("touchend", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full" ref={inputRef}>
      <Label className="font-medium text-[14px] text-primary">{label}</Label>
      <div className="relative w-full">
        <div
          className={cn(
            "flex h-10 w-full items-center rounded-md border border-primary text-primary-900 px-3 py-2 text-sm cursor-pointer",
            selectedOptions.length === 0 && "text-muted-foreground"
          )}
          onClick={toggleDropdown}
        >
          {selectedOptions.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedOptions.map((option) => (
                <span
                  key={option}
                  className="flex items-center bg-primary text-white rounded px-2 py-1 text-xs"
                >
                  {options.find((opt) => opt.value === option)?.label}
                  <button
                    type="button"
                    className="ml-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(option);
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <span>Selecione opções...</span>
          )}
        </div>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white border border-gray-300 shadow-lg">
            <input
              type="text"
              placeholder="Pesquise..."
              className="w-full px-3 py-2 text-sm border-b border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul className="max-h-40 w-full overflow-y-auto">
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={cn(
                    "flex items-center cursor-pointer select-none px-3 py-2 text-sm hover:bg-gray-200",
                    selectedOptions.includes(option.value)
                      ? "bg-gray-100 font-medium"
                      : ""
                  )}
                  onClick={() => toggleOption(option.value)}
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option.value)}
                    onChange={() => toggleOption(option.value)}
                    className="mr-2"
                  />
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
    </div>
  );
};

MultiSelectInput.displayName = "MultiSelectInput";

export { MultiSelectInput };
