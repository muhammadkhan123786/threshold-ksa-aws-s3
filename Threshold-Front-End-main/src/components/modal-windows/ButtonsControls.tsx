import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { FormControlsProps } from './FormRow';
import { useState } from 'react';
import { closeModal } from 'store/controlsSlice';
import { useDispatch } from 'react-redux';

interface ButtonsControlsProps extends FormControlsProps {
    customIsLoading?: boolean;
}

const ButtonsControls = ({
    isValid = true,
    saveText = 'form.save',
    cancelText = 'form.cancel',
    handleSave = async () => {},
    handleCancel = async () => {},
    customIsLoading = false,
}: ButtonsControlsProps) => {
    const { trans } = useLocales();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const handleCancelWrapper = async () => {
        dispatch(closeModal());
        await handleCancel();
    };

    const handleSaveWrapper = async () => {
        setIsLoading(true);
        await handleSave();
        setIsLoading(false);
    };

    return (
        <Theme.ButtonsContainer>
            <Theme.Cancel type="button" onClick={handleCancelWrapper}>
                {trans(cancelText)}
            </Theme.Cancel>

            <Theme.Save
                type="button"
                disabled={!isValid || isLoading || customIsLoading}
                onClick={handleSaveWrapper}
            >
                {trans(isLoading || customIsLoading ? 'form.loading' : saveText)}
            </Theme.Save>
        </Theme.ButtonsContainer>
    );
};

export default ButtonsControls;
