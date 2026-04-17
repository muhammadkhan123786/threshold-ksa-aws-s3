import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import { useDispatch, useSelector } from 'react-redux';
import { selectControls } from 'store';
import { Save } from '../Theme';
import { setModalContent } from 'store/controlsSlice';

interface Props {
    type: 'success' | 'warning' | 'info';
}

export const ModalAlert = ({ type }: Props) => {
    const dispatch = useDispatch();
    const { trans } = useLocales();
    const { modalContent } = useSelector(selectControls);

    const isSuccess = type === 'success';

    const subtitle = isSuccess ? trans('success.message') : modalContent.subtitle;

    return (
        <>
            <Theme.AlertImage src={`/assets/icons/${type}-icon.png`} alt={type} />
            <Theme.AlertTitle variant="p" value={trans(type, modalContent.title)} />
            <Theme.AlertSubtitle variant="p" value={subtitle} />
            <Save
                onClick={() => {
                    dispatch(
                        setModalContent({
                            modalContent: {
                                type: 'none',
                                title: '',
                                subtitle: '',
                            },
                        }),
                    );
                }}
            >
                {trans('form.confirm')}
            </Save>
        </>
    );
};
