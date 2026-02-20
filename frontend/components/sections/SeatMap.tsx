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

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded ${color}`} />
    <span className="text-[#a1a1aa] text-sm">{label}</span>
  </div>
);

export default function SeatMap({ seats, selectedSeats = [], onSeatSelect }: SeatArray) {
  const sortedSeats = [...seats].sort((a, b) => a.seat_number - b.seat_number);
  const rows = [];

  //Divide the 30 chairs into 3 rows of 10
  for (let i = 0; i < sortedSeats.length; i += 10) {
    rows.push(sortedSeats.slice(i, i + 10));
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

      <div className="mt-12 pt-6 border-t border-[#27272a] flex flex-wrap justify-center gap-6">
        <LegendItem color="bg-[#e4e4e7]" label="Lliure" />
        <LegendItem color="bg-[#f97316] shadow-lg shadow-orange-500/30" label="Seleccionat" />
        <LegendItem color="bg-[#3f3f46]" label="Reservat" />
        <LegendItem color="bg-[#27272a]" label="Venut" />
      </div>
    </div>
  );
}
