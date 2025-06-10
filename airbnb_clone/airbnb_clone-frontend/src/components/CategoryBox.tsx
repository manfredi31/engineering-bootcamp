import React, { useCallback } from 'react';
import type { IconType } from "react-icons";
import { useSearchParams } from 'react-router-dom';

interface CategoryBoxProps {
    label: string;
    icon: IconType;
    description: string;
    selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
    label,
    icon: Icon,
    description,
    selected
}) => {

    const [ searchParams, setSearchParams ] = useSearchParams();

    const handleClick = useCallback(() => {
        const newParams = new URLSearchParams(searchParams);
        const currentCategory = newParams.get('category')
        if (currentCategory === label) {
            newParams.delete('category')
        } else {
            newParams.set('category', label);
        }

        setSearchParams(newParams)
        
    }, [label, searchParams])

    return (
        <div 
        onClick={handleClick}
        className={`
            flex
            flex-col
            items-center
            justify-center
            gap-2
            p-3
            border-b-2
            hover:text-neutral-800
            transition
            cursor-pointer
            ${selected ? 'border-b-neutral-800' : 'border-transparent'}
            ${selected ? 'text-neutral-800' : 'text-neutral-500'}
        `}>
            <Icon size={26} />
            <div className="font-medium text-sm">
                {label}
            </div>
        </div>
    );
}

export default CategoryBox;