import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';

export const InfoWrap = styled.div`
    display: flex;
    width: 100%;
    gap: 1rem;
    flex-direction: column;
`;

export const WrapRecords = styled.div.attrs({ className: '' })`
    display: flex;
    flex-direction: row;
    gap: 4rem;
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

export const DivWrapper = styled.div`
    width: 100%;
    font-size: 18px;
    font-weight: 500;
`;

export const EmptyDOCSWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const LabelAndIconWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: auto;
`;

export const StatusContainer3 = styled.div`
    width: 100%;
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    margin-top: 16px;
`;

export const InfoRow = styled.div`
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    color: #555;
    border-bottom: 1px solid #eaecf0;
`;

export const Label = styled.div`
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    line-height: 18px;
    color: rgba(32, 36, 3, 0.3);
`;

export const ContainersWrap = styled.div`
    display: flex;
    width: 100%;
    gap: 3rem;
    flex-direction: column;
`;

export const DivWraper = styled.div`
    width: 100%;
    font-size: 18px;
    font-weight: 500;
`;

export const LabelAndIconWaper = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: auto;
`;

export const FileContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const FileIcon = styled.div`
    cursor: pointer;
    font-size: 1.5rem;
`;

export const FileName = styled.span`
    color: hsla(67, 84.6%, 7.6%, 0.85);
    font-size: 16px;
    font-weight: 500px;
    text-decoration: underline;
    line-height: 20px;
`;

export const FileButton = styled.button`
    display: flex;
    align-item: center;
    justify-codenet: center;
    gap: 4px;
`;

export const FileIconWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
`;

export const DocumentSectionWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
`;
