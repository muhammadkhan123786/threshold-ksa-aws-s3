import { memo, ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Header } from '../../components/base/header';
import { Aside } from '../../components/base/aside';
import { Modal } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { selectControls } from 'store';
import { StoreState } from 'libs/types';
import { setAcademy } from 'store/academySlice';
import { AsideMobile } from 'components/base/aside/AsideMobile';

interface DashboardLayoutProps {
    children: ReactNode;
}

const Main = styled.main`
    display: flex;
    min-height: 100vh;
    min-width: 360px;
    width: 100%;
    height: 100%;
    position: relative;
`;

interface ContentProps {
    menuOpen: boolean;
    direction: 'ltr' | 'rtl';
}

// Helper function to get margin values based on direction
const getMargin = (
    menuOpen: boolean,
    direction: 'ltr' | 'rtl',
    values: { open: string; closed: string },
) =>
    direction === 'ltr'
        ? `80px 0 0 ${menuOpen ? values.open : values.closed}`
        : `80px ${menuOpen ? values.open : values.closed} 0 0`;

const getContentStyles = (menuOpen: boolean, direction: 'ltr' | 'rtl') => ({
    display: 'flex',
    flex: 1,
    height: 'auto',
    // padding: '0px 20px',
    transition: 'all 0.3s ease-in-out',
    width: '100%',
    margin: getMargin(menuOpen, direction, { open: '215px', closed: '80px' }),

    '@media (max-width: 1400px)': {
        margin: getMargin(menuOpen, direction, { open: '215px', closed: '80px' }),
    },
    '@media (max-width: 1200px)': {
        margin: getMargin(menuOpen, direction, { open: '215px', closed: '80px' }),
    },
    '@media (max-width: 992px)': {
        margin: getMargin(menuOpen, direction, { open: '215px', closed: '80px' }),
    },
    '@media (max-width: 768px)': {
        margin: getMargin(menuOpen, direction, { open: '215px', closed: '70px' }),
    },
    '@media (max-width: 576px)': {
        margin: '60px 0 0 0',
        padding: '0px 10px',
    },
});
export const Content = styled.div.attrs<ContentProps>((props) => ({
    className: 'relative flex flex-col flex-1',
    dir: props.direction || 'ltr',
}))<ContentProps>`
    ${({ menuOpen, direction }) => getContentStyles(menuOpen, direction)}
`;

export const DashboardLayout = memo(({ children }: DashboardLayoutProps) => {
    const { modalContent } = useSelector(selectControls);
    const dispatch = useDispatch();
    const user = useSelector((state: StoreState) => state.auth?.entities);
    const { isRTL } = useSelector<any>((state) => state?.locales) as any;
    const [menuOpen, setMenuOpen] = useState(() => {
        return localStorage.getItem('menuOpen') === 'true';
    });

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 576);
            if (window.innerWidth <= 576 && menuOpen) {
                setMenuOpen(false);
                localStorage.setItem('menuOpen', 'false');
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [menuOpen]);

    const toggleMenu = () => {
        setMenuOpen((prev) => {
            const newState = !prev;
            localStorage.setItem('menuOpen', newState.toString());
            return newState;
        });
    };

    useEffect(() => {
        if (user?.academy) dispatch(setAcademy({ academy: user.academy }));
    }, [user, dispatch]);

    return (
        <Main>
            {modalContent.type !== 'none' && <Modal />}
            {!isMobile && <Aside toggleMenu={toggleMenu} menuOpen={menuOpen} />}
            {isMobile && menuOpen && <AsideMobile toggleMenu={toggleMenu} menuOpen={menuOpen} />}
            <Header menuOpen={menuOpen} toggleMenu={toggleMenu} />
            <Content direction={isRTL ? 'rtl' : 'ltr'} menuOpen={menuOpen}>
                {isMobile && <div>{children}</div>}
                {!isMobile && <div className={isRTL ? 'pl-6' : 'pr-6'}>{children}</div>}
            </Content>
        </Main>
    );
});
