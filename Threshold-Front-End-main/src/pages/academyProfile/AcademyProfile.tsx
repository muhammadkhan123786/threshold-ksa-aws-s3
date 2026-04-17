import { useForm } from 'react-hook-form';
import * as Theme from './Theme';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { useEditAcademyInfoSchema } from 'schemas';
import { CheckBoxes, InputController, Loader } from 'components';
import { academyAPIs } from 'services/apis';
import { fireAlert } from 'libs/helpers';
import { selectAcademy } from 'store';
import { useEffect, useState } from 'react';
import { FormRow } from 'components/modal-windows/FormRow';
import { SingleSelectionCheckbox } from 'components/check-Boxes';

export const AcademyProfile = () => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const { academy } = useSelector(selectAcademy);
    const [isLoading, setLoading] = useState(true);

    const editAcademyInfoSchema = useEditAcademyInfoSchema();
    const {
        formState: { isValid },
        control,
        getValues,
        reset,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(editAcademyInfoSchema),
    });

    const fetchAcademyAction = async () => {
        setLoading(true);

        if (academy.id) {
            const {
                payload: { data },
            } = await dispatch(academyAPIs.getAcademy(academy?.id)());

            setLoading(false);

            reset({
                ...data?.payload,
            });
        }
    };

    useEffect(() => {
        if (academy) {
            fetchAcademyAction();
        }
    }, [academy]);

    const handleSave = async () => {
        if (academy?.id) {
            const response = await dispatch(academyAPIs.updateAcademy(academy?.id)(getValues()));

            const isSuccess = [201, 200].includes(response?.payload?.status);

            fireAlert(
                {
                    type: isSuccess ? 'success' : 'warning',
                    title: isSuccess ? 'Success' : 'Warning',
                    subtitle: isSuccess
                        ? 'Academy has been updated successfully'
                        : response?.payload?.payload?.message || 'Error occurred',
                },
                dispatch,
            );
        }
    };

    if (isLoading) return <Loader />;

    return (
        <Theme.Body>
            <Theme.Content>
                <h2 className="font-bold text-[25px]">{trans('academy.info')}</h2>
                <InputController
                    autoComplete="name"
                    {...{
                        control,
                        name: 'name',
                        label: trans('signup.academyName'),
                        placeholder: trans('signup.academyNamePlaceholder'),
                    }}
                />

                <FormRow
                    title={trans('signup.isMultiBranch')}
                    content={
                        <SingleSelectionCheckbox
                            control={control}
                            name="isMultiBranch"
                            disabled
                            options={[
                                {
                                    value: 'true',
                                    label: trans('form.isMultiBranch.true'),
                                    disabled: true,
                                },
                                {
                                    value: 'false',
                                    label: trans('form.isMultiBranch.false'),
                                    disabled: true,
                                },
                            ]}
                        />
                    }
                />

                <InputController
                    autoComplete="number"
                    {...{
                        control,
                        name: 'registrationNumber',
                        label: trans('signup.commercialRegistrationNumber'),
                        placeholder: trans('signup.commercialRegistrationNumberPlaceholder'),
                    }}
                />

                <InputController
                    autoComplete="number"
                    {...{
                        control,
                        name: 'contactNumber',
                        label: trans('signup.contactNumber'),
                        placeholder: trans('signup.contactNumberPlaceholder'),
                    }}
                />

                <Theme.Button
                    type="button"
                    onClick={handleSave}
                    disabled={!isValid}
                    style={{
                        width: 'fit-content',
                        margin: 'auto',
                        padding: '10px 25px',
                    }}
                >
                    {trans('form.save')}
                </Theme.Button>
            </Theme.Content>

            <Theme.Content>
                <h2 className="font-bold text-[25px]">{trans('academy.profiles')}</h2>

                <div className="w-fit flex flex-col items-center gap-[30px] m-[10px] p-[30px] bg-[#f7f7f7] rounded-lg border">
                    <Theme.Image src="/assets/images/football.png" alt="football" />
                    <h3 className="text-[20px] font-bold">{trans('academy.football')}</h3>
                    <div className="flex gap-[20px] justify-between items-center">
                        <div className="flex flex-col items-center">
                            <h3 className="text-[15px] font-[500]">{trans('academy.teams')}</h3>
                            <h3 className="text-[15px] font-[500]">{academy?.teams?.length}</h3>
                        </div>
                        <div className="flex flex-col items-center">
                            <h3 className="text-[15px] font-[500]">{trans('academy.athletes')}</h3>
                            <h3 className="text-[15px] font-[500]">{academy?.athletes?.length}</h3>
                        </div>
                        <div className="flex flex-col items-center">
                            <h3 className="text-[15px] font-[500]">{trans('academy.coaches')}</h3>
                            <h3 className="text-[15px] font-[500]">{academy?.coaches?.length}</h3>
                        </div>
                    </div>
                </div>
            </Theme.Content>
        </Theme.Body>
    );
};
