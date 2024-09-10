import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Select as RadixSelect,
  SelectGroup,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectItemText,
  SelectItemIndicator,
} from "@radix-ui/react-select";

export interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: string[];
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
}) => {
  return (
    <RadixSelect value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full border p-2 rounded flex justify-between items-center">
        <SelectValue placeholder="Selecione uma opção" />
        <ChevronDown className="ml-2 h-4 w-4" />
      </SelectTrigger>
      <SelectContent className="bg-white border rounded shadow-lg">
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              <SelectItemText>{option}</SelectItemText>
              <SelectItemIndicator>
                {value === option && <Check className="ml-2 h-4 w-4" />}
              </SelectItemIndicator>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </RadixSelect>
  );
};

export { Select };
