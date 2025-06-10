import { useNavigate } from "react-router-dom";
import Heading from "./Heading";
import Button from "./Button";

interface EmptyStateProps {
    title?: string;
    subtitle?: string
    showReset?: boolean;
    onReset?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title = "No exact matches",
    subtitle = "Try changing or removing some of your filters",
    showReset,
    onReset
}) => {
    const navigate = useNavigate();

    const handleReset = () => {
        if (onReset) {
            onReset();
        } else {
            navigate("/");
        }
    };

    return (
        <div className="
            h-[60vh]
            flex
            flex-col
            gap-2
            justify-center
            items-center
            "
            
            >
                <Heading
                    center
                    title={title}
                    subtitle={subtitle}
                ></Heading>
                <div className="w-48 mt-4">
                    {showReset && (
                        <Button
                            outline
                            label="Remove all filters"
                            onClick={handleReset}
                        ></Button>

                    )}
                </div>
            </div>
    )

}

export default EmptyState