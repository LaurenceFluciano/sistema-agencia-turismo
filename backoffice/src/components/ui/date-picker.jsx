import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Calendar } from "./calendar";


function DatePicker({ date, setDate }) {
  return (
    <Popover>
        <PopoverTrigger asChild>
            <Button>Selecionar data</Button>
        </PopoverTrigger>

        <PopoverContent>
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
            />
        </PopoverContent>
    </Popover>
  );
}

export { DatePicker }