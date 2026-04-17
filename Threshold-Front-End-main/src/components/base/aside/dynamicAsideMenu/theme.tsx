import styled from 'styled-components';

export const MenuContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 8px;
    width: 100%;
    user-select: none;
`;

export const MenuItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 6px;
    margin-bottom: 4px;
    &:hover {
        background-color: #c0d33030;
    }
`;
export const MenuItemContact = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 6px;
    margin-bottom: 4px;
    &:hover {
        background-color: #c0d33030;
    }
`;

export const MenuIcon = styled.img`
    width: 24px;
    height: 24px;
    margin-inline-end: 8px;
`;

export const MenuText = styled.span`
    color: #212529;
    flex: 1;
    font-weight: bold;
    color: rgba(32, 32, 32, 0.85);
    word-wrap: break-word;
`;

export const MenuNestedText = styled.span`
    color: #212529;
    flex: 1;
    color: rgba(32, 32, 32, 0.85);
    word-wrap: break-word;
`;

export const SubMenu = styled.div`
    display: flex;
    flex-direction: column;
`;

export const SubMenuItem = styled.div`
    display: flex;
    align-items: center;
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 4px;
    margin-bottom: 4px;
    &:hover {
        background-color: #c0d33030;
    }
`;
export const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    overflow-x: hidden;
    transition: margin 0.3s ease-in-out;
    @media (max-width: 768px) {
        height: auto;
        height: 80vh;
    }
`;
