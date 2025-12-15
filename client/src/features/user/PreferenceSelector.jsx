import React, { useState } from 'react';

const PreferenceSelector = ({
    title,
    items = [],
    options = [],
    onChange,
    icon,
    colorClass
}) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = inputValue.trim();
            if (value && !items.includes(value)) {
                onChange([...items, value]); 
                setInputValue('');
            }
        }
    };

    const handleAddOption = (opt) => {
        if (!items.includes(opt)) {
            onChange([...items, opt]);
        }
    };

    const handleRemove = (itemToRemove) => {
        onChange(items.filter(i => i !== itemToRemove));
    };

    return (
        <div className="mb-6">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium flex items-center gap-2">
                {icon} {title}
            </label>

            <div className="flex flex-wrap gap-2 mb-2">
                {items.map(item => (
                    <span key={item} className={`px-3 py-1 rounded-full text-sm border flex items-center gap-2 ${colorClass.selected}`}>
                        {item}
                        <button
                            type="button"
                            onClick={() => handleRemove(item)}
                            className="hover:text-black font-bold focus:outline-none"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>

            <div className="relative mb-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Введіть свій варіант та натисніть Enter..."
                    className="text-sm w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none py-1 dark:text-gray-300 transition-colors"
                />
            </div>

            <div className="flex flex-wrap gap-2">
                {options.map(opt => (
                    !items.includes(opt) && (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => handleAddOption(opt)}
                            className={`px-3 py-1 rounded-full text-xs border transition-all ${colorClass.unselected}`}
                        >
                            + {opt}
                        </button>
                    )
                ))}
            </div>
        </div>
    );
};

export default PreferenceSelector;