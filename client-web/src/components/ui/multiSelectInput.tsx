import * as React from "react";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";
import { Tag } from "@/domain/tags";
import { Label } from "@radix-ui/react-label";

export interface MultiSelectInputProps {
  label?: string;
  options: Tag[];
  selectedOptions: Tag[];
  onChange: (selected: Tag[]) => void;
  error?: string;
}

const MultiSelectInput = ({
  label,
  options,
  selectedOptions = [],
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
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  const toggleOption = (value: Tag) => {
    const isSelected = selectedOptions.find((option) => option.id === value.id);

    if (isSelected) {
      onChange(selectedOptions.filter((option) => option.id !== value.id));
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
      <Label className="font-medium text-[14px] ">{label}</Label>
      <div className="relative w-full">
        <div
          data-cy="multiSelect"
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
                  key={option.id}
                  className="flex items-center bg-primary text-white rounded px-2 py-1 text-xs"
                >
                  {options.find((opt) => opt.id === option.id)?.name}
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
                  key={option.id}
                  className={cn(
                    "flex items-center cursor-pointer select-none px-3 py-2 text-sm hover:bg-gray-200",
                    selectedOptions.find((option) => option.id)
                      ? "bg-gray-100 font-medium"
                      : ""
                  )}
                  onClick={() => toggleOption(option)}
                >
                  <input
                    data-cy="multiSelect-item"
                    type="checkbox"
                    checked={selectedOptions.some(
                      (selectedOption) => option.id === selectedOption.id
                    )}
                    onChange={() => toggleOption(option)}
                    className="mr-2"
                  />
                  {option.name}
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
