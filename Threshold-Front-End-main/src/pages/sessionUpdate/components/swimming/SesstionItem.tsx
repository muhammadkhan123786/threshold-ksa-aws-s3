import React, { useEffect, useRef } from 'react';
import { RadioButton, InputController, CheckBoxes } from 'components';
import * as Theme from './Theme';
import { arrayToSelectOptions } from 'libs/helpers';
import { SessionRecordStatus } from 'libs/enums';
import { getAvatarPlaceholder } from 'libs/constants';
import { useLocales } from 'hooks/locales';
import { useFormContext, FieldError } from 'react-hook-form';

type ErrorType = {
    [key: string]: {
        status?: FieldError;
        scale?: FieldError;
        comment?: FieldError;
    };
};

export const SwimmingSessionItem = ({ avatar, firstName, lastName, id }: any) => {
    const { trans } = useLocales();
    const {
        control,
        watch,
        formState: { errors },
    } = useFormContext();

    const fieldErrors = (errors as ErrorType) ?? {};

    const statusRef = useRef<HTMLDivElement>(null);
    const scaleRef = useRef<HTMLDivElement>(null);
    const commentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (fieldErrors[id]?.status && statusRef.current) {
            statusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (fieldErrors[id]?.scale && scaleRef.current) {
            scaleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

            {watch(`${id}.status`) !== 'absent' &&
                watch(`${id}.status`) !== 'reason' &&
                watch(`${id}.status`) !== 'injury' && (
                    <>
                        <Theme.Section>
                            <Theme.TitleSection>
                                <Theme.Alignment />
                                <Theme.Name>{trans('session.scale')}</Theme.Name>
                            </Theme.TitleSection>
                            <Theme.FieldSection ref={scaleRef}>
                                <RadioButton
                                    control={control}
                                    name={`${id}.scale`}
                                    options={Array(10)
                                        .fill(null)
                                        .map((_, index) => ({
                                            value: (index + 1).toString(),
                                            label: (index + 1).toString(),
                                        }))}
                                />
                                {fieldErrors[id]?.scale?.message ||
                                    (!watch(`${id}.scale`) && (
                                        <Theme.Error>
                                            {fieldErrors[id]?.scale?.message ||
                                                (!watch(`${id}.scale`) &&
                                                    trans('validation.editSession.scaleRequired'))}
                                        </Theme.Error>
                                    ))}
                            </Theme.FieldSection>
                        </Theme.Section>
                    </>
                )}
            <Theme.Section>
                <Theme.TitleSection>
                    <Theme.Alignment />
                    <Theme.Name>{trans('session.comment')}</Theme.Name>
                </Theme.TitleSection>
                <Theme.FieldSection ref={commentRef}>
                    <InputController control={control} name={`${id}.comment`} />
                    {/* {fieldErrors[id]?.comment && (
                        <Theme.Error>{fieldErrors[id]?.comment?.message}</Theme.Error>
                    )} */}
                </Theme.FieldSection>
            </Theme.Section>
        </Theme.Body>
    );
};
