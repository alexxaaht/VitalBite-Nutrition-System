import React from 'react';

const NutritionBadge = ({ label, value, unit, color }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        green: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        orange: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
        red: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    };

    return (
        <div className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl ${colors[color] || colors.blue}`}>
            <div className="flex items-baseline gap-0.5 mb-0.5">
                <span className="text-base font-bold leading-none">{value}</span>
                <span className="text-[10px] font-medium opacity-80">{unit}</span>
            </div>
            <span className="uppercase tracking-wide text-[9px] font-bold opacity-60">
                {label}
            </span>
        </div>
    );
};

export default NutritionBadge;