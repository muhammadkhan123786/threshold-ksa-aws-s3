import React, { useState } from 'react';
import { useLayer, Arrow } from 'react-laag';
import * as Theme from './Theme';

interface DropdownMenuProps {
    options: { label: string; onClick: () => void }[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
        isOpen,
        onOutsideClick: () => setIsOpen(false),
        onDisappear: () => setIsOpen(false),
        auto: true,
        placement: 'bottom-end',
        triggerOffset: 10,
    });

    const enhancedArrowProps = {
        ...arrowProps,
        onPointerEnterCapture: () => {},
        onPointerLeaveCapture: () => {},
    };

    return (
        <div>
            <Theme.IconButton {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
                <img
                    src="/assets/icons/athlete-list-more-icon.png"
                    alt="more"
                    style={{ width: 24, height: 24 }}
                />
            </Theme.IconButton>
            {isOpen &&
                renderLayer(
                    <Theme.StyledDropdownMenu {...layerProps}>
                        {options.map((option, index) => (
                            <Theme.DropdownItem
                                key={`dropdown-option-${index}`}
                                onClick={() => {
                                    option.onClick();
                                    setIsOpen(false);
                                }}
                            >
                                {option.label}
                            </Theme.DropdownItem>
                        ))}
                        <Arrow {...enhancedArrowProps} />
                    </Theme.StyledDropdownMenu>,
                )}
        </div>
    );
};

export default DropdownMenu;
