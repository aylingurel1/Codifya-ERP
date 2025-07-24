import React, {
  useState,
  createContext,
  useContext,
  ReactNode,
  useRef,
  useEffect,
} from "react";

interface SelectContextType {
  value: string;
  setValue: (val: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

interface SelectProps {
  value?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
  onValueChange?: (val: string) => void;
  children: ReactNode;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  defaultValue,
  onChange,
  onValueChange,
  children,
  className,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const actualValue = value !== undefined ? value : internalValue;

  const handleChange = (val: string) => {
    setInternalValue(val);
    onChange?.(val);
    onValueChange?.(val);
    setIsOpen(false); // Seçim yapıldığında dropdown'u kapat
  };

  // Dropdown dışında tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <SelectContext.Provider
      value={{ value: actualValue, setValue: handleChange, isOpen, setIsOpen }}
    >
      <div ref={selectRef} className={`relative ${className}`}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
}
export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  children,
  className,
}) => {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("SelectTrigger must be used within Select");

  return (
    <div
      className={`border px-3 py-2 rounded cursor-pointer bg-white hover:bg-gray-50 transition-colors flex justify-between items-center ${className}`}
      onClick={() => ctx.setIsOpen(!ctx.isOpen)}
    >
      {children}
      <svg
        className={`w-4 h-4 transition-transform ${
          ctx.isOpen ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );
};

interface SelectContentProps {
  children: ReactNode;
  className?: string;
}
export const SelectContent: React.FC<SelectContentProps> = ({
  children,
  className,
}) => {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("SelectContent must be used within Select");

  if (!ctx.isOpen) return null; // Kapalıysa hiçbir şey render etme

  return (
    <div
      className={`absolute top-full left-0 right-0 mt-1 border rounded bg-white shadow-lg z-50 max-h-60 overflow-y-auto ${className}`}
    >
      {children}
    </div>
  );
};

interface SelectItemProps {
  value: string;
  children: ReactNode;
  className?: string;
}
export const SelectItem: React.FC<SelectItemProps> = ({
  value,
  children,
  className,
}) => {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("SelectItem must be used within Select");

  const isSelected = ctx.value === value;

  return (
    <div
      className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${
        isSelected ? "bg-blue-50" : ""
      } ${className}`}
      onClick={() => ctx.setValue(value)}
      aria-selected={isSelected}
    >
      {children}
    </div>
  );
};

interface SelectValueProps {
  children?: ReactNode;
  className?: string;
  placeholder?: string;
}
export const SelectValue: React.FC<SelectValueProps> = ({
  children,
  className,
  placeholder,
}) => {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("SelectValue must be used within Select");

  const displayValue = ctx.value || children || placeholder;

  return (
    <span
      className={`text-left truncate ${
        !ctx.value ? "text-gray-500" : ""
      } ${className}`}
    >
      {displayValue}
    </span>
  );
};
