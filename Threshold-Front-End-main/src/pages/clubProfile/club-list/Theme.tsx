import styled from 'styled-components';

export const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
`;

export const Card = styled.div`
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.05);
`;

export const AvatarSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 16px;
`;

export const Avatar = styled.div`
    width: 60px;
    height: 60px;
    background-color: #ccc;
    border-radius: 50%;
`;

export const Description = styled.div`
    font-size: 12px;
    color: #666;
    margin-top: 8px;
`;

export const Details = styled.div`
    flex: 1;
`;

export const Info = styled.div`
    margin-top: 8px;
`;

export const Label = styled.div`
    font-size: 14px;
    color: #333;
    margin-bottom: 4px;
`;

export const Value = styled.span.attrs({ className: '' })`
    font-weight: bold;
`;

export const Body = styled.div`
    width: 100%;
    background-color: #f9f9f9;
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 16px 24px;
    border-radius: 8px;
    margin-bottom: 16px;
    box-sizing: border-box;

    margin-top: 24px;
`;

export const Title = styled.h2`
    font-size: 14px;
    font-weight: bold;
    color: rgba(32, 32, 32, 0.3);
`;

export const AddButton = styled.button`
    background-color: transparent;
    border: none;
    color: #202020;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:hover {
        color: #a4b228;
    }

    &::before {
        content: '+';
        font-size: 18px;
    }
`;
