import styled from 'styled-components';
import { Image as DefaultImage, Text as DefaultText } from 'components';

export const Body = styled.div.attrs({ className: 'flex justify-center' })`
    cursor: pointer;
`;

export const Avatar = styled(DefaultImage)`
    margin: auto;
    grid-row: span 2;
    width: 40px;
    height: 40px;
    border-radius: 100px;
`;

export const AvatarRole = styled(DefaultText)`
    margin-right: auto;
    opacity: 0.5;
`;

export const DropdownContainer = styled.div`
    position: relative;
`;
export const Icon = styled.img`
    margin: 0px 10px;
`;

export const DropdownContent = styled.div<any>`
    display: ${(props) => (props.isOpen ? 'block' : 'none')};
    position: absolute;
    width: 261px;
    flex-wrap: wrap;
    display: flex;
    flex-direction: column;
    top: 100%;
    z-index: 100002;
    background-color: #fff;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 20px 0;
`;

export const MenuItem = styled.div.attrs({
    className: 'truncate',
})`
    user-select: none;
    padding: 8px 0px;
    cursor: pointer;
    color: #333;
    padding: 6px 24px;
    font-weight: 500;
`;

export const AvatarImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;

    margin-inline-end: 10px;
`;

export const MenuLine = styled.div`
    border-bottom: 1px #eaecf0 solid;
    margin: 12px 20px;
`;
