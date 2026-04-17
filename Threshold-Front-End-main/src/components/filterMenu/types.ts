import { Control } from 'react-hook-form';

export enum FieldType {
    Select = 'select',
    Text = 'text',
    Boolean = 'boolean',
    NumberRange = 'numberRange',
}

export interface FilterField {
    name: string;
    label: string;
    type: 'select' | 'text' | 'boolean' | 'numberRange';
    options?: { value: string; label: string }[];
    placeholder?: string;
    transSuffix?: string;
    range?: {
        greaterThanPlaceholder: string;
        lessThanPlaceholder: string;
    };
    mappingFilterKey?: string;
}

export interface FilterMenuProps {
    fields: FilterField[];
    onApplyFilters: any;
    length: number;
}

export interface FilterItemProps {
    fields: FilterField[];
    control: Control<any>;
}
