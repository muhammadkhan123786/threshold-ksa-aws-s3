import { useEffect, useRef } from 'react';
import { InputController, CheckBoxes } from 'components';
import * as Theme from './Theme';
import { arrayToSelectOptions } from 'libs/helpers';
import { SessionRecordStatus } from 'libs/enums';
import { getAvatarPlaceholder } from 'libs/constants';
import { useLocales } from 'hooks/locales';
import { useFormContext, FieldError } from 'react-hook-form';

type ErrorType = {
    [key: string]: {
        status?: FieldError;
        comment?: FieldError;
    };
};

export const PreparationComplete = ({ avatar, firstName, lastName, id }: any) => {
    const { trans } = useLocales();
    const {
        control,
        watch,
        formState: { errors },
    } = useFormContext();

    const fieldErrors = (errors as ErrorType) ?? {};

    const statusRef = useRef<HTMLDivElement>(null);
    const commentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (fieldErrors[id]?.status && statusRef.current) {
            statusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (fieldErrors[id]?.comment && commentRef.current) {
            commentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [fieldErrors, id]);

    return (
        <Theme.Body>
            <Theme.Section>
                <Theme.TitleSection>
                    <Theme.Avatar src={avatar || getAvatarPlaceholder()} alt={firstName} />
                    <Theme.Name>{`${firstName} ${lastName}`}</Theme.Name>
                </Theme.TitleSection>
                <Theme.FieldSection ref={statusRef}>
                    <CheckBoxes
                        singleSelection
                        control={control}
                        name={`${id}.status`}
                        options={arrayToSelectOptions({
                            array: SessionRecordStatus,
                            transSuffix: 'session.',
                            trans,
                        })}
                    />
                    {fieldErrors[id]?.status && (
                        <Theme.Error>{fieldErrors[id]?.status?.message}</Theme.Error>
                    )}
                </Theme.FieldSection>
            </Theme.Section>

            <Theme.Section>
                <Theme.TitleSection>
                    <Theme.Alignment />
                    <Theme.Name>{trans('session.comment')}</Theme.Name>
                </Theme.TitleSection>
                <Theme.FieldSection ref={commentRef}>
                    <InputController control={control} name={`${id}.comment`} />
                </Theme.FieldSection>
            </Theme.Section>
        </Theme.Body>
    );
};
