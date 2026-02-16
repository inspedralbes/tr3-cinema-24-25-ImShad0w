import { Square } from "lucide-react";

type Seat = {
  id: number;
  seat_number: number;
  status: "available" | "reserved" | "sold";
}

type SeatProps = {
  seat: Seat;
  onSelect?: (seat: Seat) => void;
  isSelected?: boolean;
}

export default function SeatItem({ seat, onSelect, isSelected }: SeatProps) {
  const getSeatStyles = () => {
    if (seat.status === "sold") {
      return "bg-[#27272a] text-[#52525b] cursor-not-allowed";
    }
    if (seat.status === "reserved") {
      return "bg-[#3f3f46] text-[#71717a] cursor-not-allowed";
    }
    if (isSelected) {
      return "bg-[#f97316] text-white shadow-lg shadow-orange-500/30";
    }
    return "bg-[#e4e4e7] text-[#18181b] hover:bg-[#d4d4d8]";
  };

  const handleClick = () => {
    if (seat.status === "available" && onSelect) {
      onSelect(seat);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={seat.status !== "available"}
      className={`w-8 h-8 rounded-t-lg rounded-b-md flex items-center justify-center text-xs font-medium transition-all duration-200 cursor-pointer ${getSeatStyles()}`}
      title={`Seat ${seat.seat_number}`}
    >
      {seat.seat_number}
    </button>
  );
}
