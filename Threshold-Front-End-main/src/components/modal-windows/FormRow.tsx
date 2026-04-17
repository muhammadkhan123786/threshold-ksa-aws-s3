import { Dispatch, Fragment, ReactNode, SetStateAction } from 'react';
import * as Theme from './Theme';

export interface FormWindowProps {
    isModal?: boolean;
    defaultValues?: any;
    activeTab?: number;
}

export interface FormControlsProps {
    isValid?: boolean;
    saveText?: string;
    cancelText?: string;
    handleSave?: (data?: any) => Promise<any>;
    handleCancel?: () => Promise<any>;
}

interface FormRowProps {
    title?: string;
    titletow?: string;
    subtitle?: string;
    content?: ReactNode;
    subRows?: { title: string; content: ReactNode }[];
    style?: any;
    contentStyle?: any;
}

export const FormRow = ({
    contentStyle,
    style,
    title,
    titletow,
    subtitle,
    content,
    subRows = [],
}: FormRowProps) => {
    const isSubRows = subRows?.length > 0;

    return (
        <Theme.Row style={style} sub={isSubRows || undefined}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Theme.Title
                    variant="p"
                    value={title || ''}
                    defaultValue=""
                    sub={isSubRows || undefined}
                />
                {titletow && <Theme.Subtitle variant="p" value={titletow} />}
            </div>
            {content && <Theme.Content style={contentStyle}>{content}</Theme.Content>}
            {subtitle && <Theme.Subtitle variant="p" value={subtitle} />}
            {isSubRows &&
                subRows &&
                subRows.map(({ title, content }, index) => (
                    <Fragment key={`${index}`}>
                        <Theme.SubRowTitle variant="p" value={title} />
                        <Theme.SubRowContent>{content}</Theme.SubRowContent>
                    </Fragment>
                ))}
        </Theme.Row>
    );
};
