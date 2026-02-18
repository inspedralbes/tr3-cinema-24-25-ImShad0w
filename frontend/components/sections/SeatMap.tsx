import SeatItem from "@/components/items/SeatItem";

type Seat = {
  id: number;
  seat_number: number;
  status: "available" | "reserved" | "sold";
}

//Props
type SeatArray = {
  seats: Seat[];
  selectedSeats?: Seat[];
  //Emit
  onSeatSelect?: (seat: Seat) => void;
}

export default function SeatMap({ seats, selectedSeats = [], onSeatSelect }: SeatArray) {
  const rows = [];

  //Divide the 30 chairs into 3 rows of 10
  for (let i = 0; i < seats.length; i += 10) {
    rows.push(seats.slice(i, i + 10));
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col items-center mb-12">
        <div className="w-72 h-1.5 bg-gradient-to-r from-transparent via-[#e4e4e7] to-transparent rounded-full shadow-[0_-2px_12px_rgba(255,255,255,0.15)]" />
        <span className="text-[#71717a] text-xs mt-3 uppercase tracking-[0.3em] font-medium">Pantalla</span>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2 justify-center">
            {row.map(seat => (
              <SeatItem
                key={seat.id}
                seat={seat}
                //Pass down to the child if its selected
                isSelected={selectedSeats.some(s => s.id === seat.id)}
                //Emit for selecting the seat
                onSelect={onSeatSelect}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
