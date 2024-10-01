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

  // Filtra as opções com base no termo de pesquisa
  React.useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  // Função para selecionar/deselecionar opções
  const toggleOption = (value: string) => {
    console.log("value", value);
    if (selectedOptions.includes(value)) {
      onChange(selectedOptions.filter((option) => option !== value));
    } else {
      onChange([...selectedOptions, value]);
    }
  };

  // Função para abrir e fechar o dropdown
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
    <div className="w-full" ref={inputRef} >
      <Label className="font-medium text-[14px] text-primary">{label}</Label>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Pesquise..."
          className={cn(
            "flex h-10 w-full rounded-md border border-primary text-primary-900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          )}
          onClick={toggleDropdown}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          
        />
        {isOpen && (
          <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md bg-white border border-gray-300 shadow-lg">
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
        )}
      </div>
      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
    </div>
  );
};

MultiSelectInput.displayName = "MultiSelectInput";

export { MultiSelectInput };
