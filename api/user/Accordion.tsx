"use client";

interface AccordionProps {
  header: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}

export default function Accordion({
  header,
  children,
  open,
  onToggle,
}: AccordionProps) {
  return (
    <div className="border border-[#E9E9E9] rounded-[14px] overflow-hidden mb-6">
      <div
        onClick={onToggle}
        className="cursor-pointer relative"
      >
        {header}
      </div>

      {open && (
        <div className="border-t px-6 py-6 bg-white border-light-gray">
          {children}
        </div>
      )}
    </div>
  );
}
