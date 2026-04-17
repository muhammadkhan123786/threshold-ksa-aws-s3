import React from 'react';

interface MultiStepFormProps {
    steps: React.ReactNode[];
    activeColor: string;
    inactiveColor: string;
    currentStep: number;
    onStepChange: (step: number) => void;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
    steps,
    activeColor,
    inactiveColor,
    onStepChange,
    currentStep,
}) => {
    return (
        <div className="w-full">
            {/* Progress Bar */}
            <div className="relative w-full flex items-center justify-between">
                {/* Underline */}
                <div
                    className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2"
                    style={{
                        zIndex: 0,
                        backgroundColor: inactiveColor,
                    }}
                >
                    <div
                        className="h-1 transition-all duration-300"
                        style={{
                            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                            backgroundColor: activeColor,
                        }}
                    ></div>
                </div>

                {/* Step Circles */}
                {steps.map((_, index) => (
                    <button
                        key={index}
                        className="relative flex flex-col items-center z-10 cursor-pointer"
                        style={{ zIndex: 1 }}
                        onClick={() => onStepChange(index + 1)}
                    >
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{
                                backgroundColor:
                                    index + 1 <= currentStep ? activeColor : inactiveColor,
                            }}
                        >
                            <span
                                className="text-white"
                                style={{
                                    color:
                                        index + 1 <= currentStep
                                            ? 'white'
                                            : 'rgba(32, 36, 3, 0.30)',
                                }}
                            >
                                {index + 1}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Step Component */}
            <div className="mt-8">{steps[currentStep - 1]}</div>
        </div>
    );
};
