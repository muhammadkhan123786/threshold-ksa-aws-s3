import { useDispatch, useSelector } from 'react-redux';
import { setLang } from 'store/localesSlice';
import { useLocales } from 'hooks/locales';
import { Body, LocaleButtonContainer, LocaleButtonText } from './theme';

export const LocaleButton = () => {
    const dispatch = useDispatch();
    const { trans } = useLocales();
    const currentLang = useSelector((state: any) => state.locales.lang);
    const isRTL = useSelector((state: any) => state.locales.isRTL);

    const newLang = currentLang === 'en' ? 'ar' : 'en';

    const handleLangChange = () => {
        dispatch(setLang(newLang));
    };

    return (
        <Body>
            <LocaleButtonContainer onClick={handleLangChange}>
                <img src="/assets/icons/lang.svg" alt="icon" />
                <LocaleButtonText>
                    {!isRTL ? trans('locales.arabic') : trans('locales.english')}
                </LocaleButtonText>
            </LocaleButtonContainer>
        </Body>
    );
};
