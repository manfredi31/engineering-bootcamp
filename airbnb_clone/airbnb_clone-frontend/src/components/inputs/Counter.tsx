import { useCallback } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface CounterProps {
    title: string;
    subtitle: string;
    value: number;
    onChange: (value: number) => void
}

const Counter: React.FC<CounterProps> = ({
    title,
    subtitle,
    value,
    onChange
}) => {

    const onAdd = useCallback(()=>{
        onChange(value + 1 )
    }, [onChange, value])
    
    const onSubtract = useCallback(()=>{
        if (value > 0) {
            onChange(value - 1)
        }
    },[onChange, value])

    return (
        <div
            className="flex flex-row items-center justify-between"
        >
            <div className="flex flex-col gap-2"
            >
                <div className="font-medium">
                    {title}
                </div>
                <div className="font-light text-gray-600">
                    {subtitle}
                </div>
            </div>
            <div className="flex flex-row gap-8"
            >
                <div
                    onClick={onSubtract}
                    className="
                        w-10
                        h-10
                        border-[1px]
                        rounded-full
                        border-neutral-400
                        flex
                        hover:opacity-60
                        transition
                        cursor-pointer
                        text-neutral-600
                        items-center
                        justify-center
                    "
                >
                    <AiOutlineMinus/>
                </div>
                <div className="font-light text-xl text-neutral-600 flex items-center">
                    {value}
                </div>
                <div
                    onClick={onAdd}
                    className="
                        w-10
                        h-10
                        border-[1px]
                        rounded-full
                        border-neutral-400
                        flex
                        hover:opacity-60
                        transition
                        cursor-pointer
                        text-neutral-600
                        items-center
                        justify-center
                    "
                >
                    <AiOutlinePlus/>
                </div>

            </div>
            

        </div>

    )
}
export default Counter