import { memo, ReactNode } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectControls } from 'store';
import { AuthBanner, Modal } from 'components';
import { LocaleButton } from './header';

interface PublicLayoutProps {
    children: ReactNode;
}

const Main = styled.main`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    min-width: 360px;
    width: 100%;
    height: 100%;
    background-color: #f7f7f7;
    position: relative;
`;

const Content = styled('div')`
    z-index: 1;
    width: 100%;
    flex-grow: 1;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const PublicLayout = memo(({ children }: PublicLayoutProps) => {
    const { modalContent } = useSelector(selectControls);

    return (
        <Main>
            {modalContent.type !== 'none' && <Modal />}
            <LocaleButton />

            <Content>{children}</Content>
        </Main>
    );
});
