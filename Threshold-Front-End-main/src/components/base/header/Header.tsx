import React, { useState, useEffect } from 'react';
import * as Theme from './Theme';
import NotificationMenu from './notifcationMenu/NotificationMenu';
import { ProfileMenu } from './profileMenu/profileMenu';
import { Breadcrumbs } from '../breadCrumps';
import styled from 'styled-components';

interface HeaderProps {
    menuOpen?: boolean;
    toggleMenu: () => void;
}

const ResponsiveCBody = styled(Theme.CBody)<{ menuOpen?: boolean }>`
    margin-inline-start: ${({ menuOpen }) => (menuOpen ? '10.5%' : '3%')};
    transition: margin 0.3s ease-in-out;
    @media (max-width: 1700px) {
        margin-inline-start: ${({ menuOpen }) => (menuOpen ? '12%' : '3%')};
    }
    @media (max-width: 1600px) {
        margin-inline-start: ${({ menuOpen }) => (menuOpen ? '14%' : '3%')};
    }
    @media (max-width: 1500px) {
        margin-inline-start: ${({ menuOpen }) => (menuOpen ? '14%' : '3%')};
    }
    @media (max-width: 1400px) {
        margin-inline-start: ${({ menuOpen }) => (menuOpen ? '16%' : '3%')};
    }
    @media (max-width: 1200px) {
        margin-inline-start: ${({ menuOpen }) => (menuOpen ? '18.5%' : '3%')};
    }
    @media (max-width: 1024px) {
        margin-inline-start: ${({ menuOpen }) => (menuOpen ? '21.5%' : '3%')};
    }
    @media (max-width: 900px) {
        margin-inline-start: ${({ menuOpen }) => (menuOpen ? '24%' : '3%')};
    }
    @media (max-width: 800px) {
        margin-inline-start: ${({ menuOpen }) => (menuOpen ? '26%' : '3%')};
    }
    @media (max-width: 768px) {
        display: none !important;
    }
    @media (max-width: 600px) {
        display: none !important;
    }
    @media (max-width: 480px) {
        display: none !important;
    }
`;

export const Header: React.FC<HeaderProps> = ({ menuOpen, toggleMenu }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 577);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 480);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Theme.Body>
            <ResponsiveCBody menuOpen={menuOpen}>
                <Breadcrumbs />
            </ResponsiveCBody>
            <Theme.UserBox>
                {isMobile && (
                    <Theme.Logo
                        onClick={toggleMenu}
                        src={'/assets/icons/side-mobile-icons.svg'}
                        alt="logo"
                    />
                )}
                <NotificationMenu />
                <ProfileMenu />
            </Theme.UserBox>
        </Theme.Body>
    );
};
