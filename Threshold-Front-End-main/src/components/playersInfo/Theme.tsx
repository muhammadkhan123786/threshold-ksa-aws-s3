import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';
import { media } from 'libs/Theme/breakpoints';
interface BadgeProps {
    status?: 'present' | 'absent' | 'rest' | string;
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'present':
            return {
                background: '#CDFFCD', // light green
                color: '#155724', // dark green
                dot: '#007F00', // green dot color
            };
        case 'absent':
            return {
                background: '#F8D7DA', // light red
                color: '#721C24', // dark red
                dot: '#dc3545', // red dot color
            };
        case 'rest':
            return {
                background: '#FFF3CD', // light yellow
                color: '#856404', // dark yellow
                dot: '#ffc107', // yellow dot color
            };
        default:
            return {
                background: '#D6D8D9', // light gray
                color: '#1B1E21', // dark gray
                dot: '#6c757d', // gray dot color
            };
    }
};

export const Body = styled.div.attrs({ className: 'flex flex-col justify-start' })`
    height: 100%;
    padding: 30px;
    gap: 50px;
`;

export const AvatarSection = styled.div.attrs({
    className: ' w-full',
})`
    height: 408px;
    border-radius: 8px;
    padding: 24px;
    gap: 5px;
    border-width: 2px;
    align-self: flex-start;
    width: 308px;
    display: flex;
    flex-direction: column;
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-self: center;
    }
`;

export const Avatar = styled(DefaultImage)`
    height: 254px;
    grid-row: span 2;
    width: 260px;
    aspect-ratio: 1;
    margin: auto;
    overflow: visible !important;
    background-color: #f3f3f3;
    border: 1px;
    border-radius: 8px;
    padding: 15px;
    img {
        width: 196px;
        height: 251px;
    }
`;

export const Name = styled(DefaultText)`
    font-size: 17px;
    font-weight: bold;
    text-align: center;
`;

export const Profile = styled(DefaultText)`
    font-size: 20px;
    font-weight: normal;
    text-align: justify;
    margin-block-end: 20px;
`;

export const Button = styled(DefaultButton)<{ $isTable?: boolean }>`
    margin: auto;
    grid-row: ${(props) => (props.$isTable ? 'span 1' : 'span 2')};
    font-size: ${(props) => (props.$isTable ? '15px' : '20px')};
    width: 100%;
`;

export const SubButton = styled(DefaultButton)<{ $isTable?: boolean }>`
    margin-inline-start: 20px;
    font-size: 15px;
    padding: 10px 16px;
    background-color: transparent;
    color: #c0d330;
    border-radius: 8px;
    border: 1px solid #c0d330;
`;

export const SubBody = styled.div`
    margin-top: auto;
    // padding-inline-start: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    // height: 100%;
    gap: 10px;
    grid-row: span 2;
`;

export const SectionDivider = styled.div.attrs({ className: 'w-full grid grid-cols-[75%_25%]' })`
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
`;

export const EditImg = styled.img`
    margin-block-start: 4.5rem;
    bottom: 2;
    margin-inline-start: 14rem;
    position: absolute;
    z-index: 500;
    width: 25px;
    cursor: pointer;
`;

export const RecordsContainer = styled.div`
    width: 150%;
    overflow-x: auto;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: #fff;
    @media (max-width: 768px) {
        width: 100%;
    }
`;

export const RecordsTable = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px; /* Vertical spacing between rows */
    text-align: left;
    min-width: 600px;
`;

export const Thead = styled.thead`
    background-color: #f8f9fa;
`;

export const TrHeader = styled.tr`
    border: 1px solid #dee2e6;
    border-radius: 8px;
    // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
        background-color: #e7f0fd;
        border-color: #2c6ed5;
    }
`;
export const Tr = styled.tr`
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
        background-color: #e7f0fd;
        border-color: #2c6ed5;
    }
`;

export const Tbody = styled.tbody``;

export const Th = styled.th`
    padding: 12px 15px;
    font-weight: bold;
    color: #6c757d;
`;

export const Td = styled.td`
    padding: 15px;
    border-bottom: none;

    @media (max-width: 768px) {
        padding: 10px;
    }
`;

export const WrapRecors = styled.div.attrs({ className: '' })`
    display: flex;
    gap: 20px;
    align-self: flex-start;
    width: 100%;
    @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
    }
`;
export const GeneralWrap = styled.div.attrs({ className: '' })`
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 5rem;
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 2rem;
    }
`;

export const StatusContainer = styled.div`
    width: 100%;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: #fff;
`;

export const StatusContainerWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
`;

export const StatusTitle = styled.h3`
    // margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
`;

export const StatusBox = styled.div`
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 15px;
    color: #fff;
    text-align: justify;
    font-size: 16px;
    font-weight: bold;

    &:last-child {
        margin-bottom: 0;
    }
`;

export const ContractBox = styled(StatusBox)`
    background-color: #f5a623; /* Orange color */
`;

export const AvailabilityBox = styled(StatusBox)`
    background-color: #7ed321; /* Green color */
`;

export const Label = styled.div`
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 8px;
`;

export const TabsContainer = styled.div`
    width: 100%;
    margin: 0 auto;
    padding: 0 10px; // Add padding to avoid content touching the edges on mobile
`;

export const TabsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap; // Allow tabs to wrap on small screens
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 10px;
    margin-bottom: 20px;
`;

export const Tabs = styled.button`
    font-size: 14px; // Smaller font size for mobile
    font-weight: bold;
    color: #8f8f8f;
    background: none;
    border: none;
    padding: 10px 15px; // Adjust padding for better spacing on mobile
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1; // Make tabs take equal space on small screens

    &.active {
        color: #d4d000;
        border-bottom: 2px solid #d4d000;
    }

    &:hover {
        color: #c0c000;
    }

    // Add media query for mobile responsiveness
    @media (max-width: 768px) {
        font-size: 12px; // Adjust font size for smaller screens
        padding: 8px 10px; // Adjust padding for smaller screens
    }
`;

export const TabContent = styled.div`
    /* padding: 20px; */
    /* background-color: #fff; */
    /* border-radius: 8px; */
    /* box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1); */
`;

export const StatusContainer2 = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 0;
`;

export const StatusBox2 = styled.div`
    flex: 1;
    padding: 20px;
    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const MetricDetails = styled.div`
    display: flex;
    flex-direction: column;
`;

export const MetricValue = styled.div`
    font-size: 32px;
    font-weight: 600;
`;

export const MetricLabel = styled.div`
    font-size: 14px;
    color: #666;
    margin-top: 8px;
`;

export const MetricSubLabel = styled.div`
    font-size: 12px;
    color: #999;
    margin-top: 4px;
`;

export const StatusIcon = styled.div<{ bgColor: string }>`
    font-size: 32px;
    color: #fff;
    background-color: ${({ bgColor }) => bgColor};
    padding: 10px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const ChartTitle = styled.h2`
    font-size: 16px;
    font-weight: bold;
    color: #000;
    // margin-bottom: 20px;
`;

export const ChartContainer = styled.div`
    padding: 20px;
    padding-block: 50px;

    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 459px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    // max-width: 35vw;
    align-items: flex-start;

    @media (max-width: 768px) {
        padding-block: 150px;
    }
`;

export const ChartContainer2 = styled.div`
    padding: 20px;
    padding-block: 50px;
    align-self: center;
    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    @media (max-width: 768px) {
        padding-block: 150px;
        width: 100%;
    }
`;

export const WrapRecords = styled.div.attrs({ className: '' })`
    display: flex;
    flex-direction: row;
    gap: 4rem;
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;
export const DivWraper = styled.div`
    width: 100%;
    font-size: 18px;
    font-weight: 500;
`;
export const StatusContainer3 = styled.div`
    width: 100%;
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    // max-width: 400px; /* Adjust the width according to your needs */
`;
export const LabelAndIconWaper = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: auto;
`;

export const InfoWrap = styled.div`
    display: flex;
    width: 100%;
    gap: 1rem;
    flex-direction: column;
`;
export const ContainersWrap = styled.div`
    display: flex;
    width: 100%;
    gap: 3rem;
    flex-direction: column;
`;

export const StatusTitle2 = styled.h3`
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
`;

export const InfoRow = styled.div`
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    color: #555;
    border-bottom: 1px solid #eaecf0;
`;

export const Label3 = styled.span`
    font-weight: bold;
    color: #000;
`;

export const UpdateButton = styled.button`
    margin-top: 15px;
    padding: 10px 20px;
    background-color: #c0d330;
    color: #fff;

    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    &:hover {
        color: #fcfcfd;
        background-color: #000;
    }
`;

export const UpdateButtonSmall = styled.button`
    padding: 5px 5px;
    background-color: #c0d330;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    margin-block-start: 10px;
    margin-inline-end: 20px;
    &:hover {
        color: #fcfcfd;
        background-color: #000;
    }
`;

export const FormSection = styled.div`
    width: 100%;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: #fff;
    margin-bottom: 20px;
`;

// Title for each section
export const SectionTitle = styled.h3`
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
`;

// Row in the form for key-value pairs
// export const InfoRow2 = styled.div`
//     margin-bottom: 10px;
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     font-size: 16px;
//     color: #555;
// `;

// Label in each row
export const Label2 = styled.span`
    font-weight: bold;
    color: #000;
`;

// Update button
export const UpdateButton2 = styled.button`
    margin-top: 15px;
    padding: 10px 20px;
    background-color: #d8f4a0;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: #333;
    font-size: 14px;
    font-weight: bold;
    &:hover {
        background-color: #c0e890;
    }
`;

// Table styles for the Health section
export const TableContainer2 = styled.div`
    width: 100%;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 20px;
`;

export const TableTitle = styled.h3`
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
`;

export const Table2 = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
`;

export const TableHeader2 = styled.th`
    padding: 10px;
    text-align: justify;
    font-size: 14px;
    font-weight: bold;
    color: #555;
    border-bottom: 1px solid #ddd;
`;

export const TableRow2 = styled.tr`
    &:nth-child(even) {
        background-color: #f9f9f9;
    }
`;

export const TableData = styled.td`
    padding: 10px;
    font-size: 14px;
    color: #555;
    border-bottom: 1px solid #ddd;
`;

export const ActionButton = styled.button`
    padding: 8px 15px;
    background-color: #d8f4a0;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: #333;
    font-size: 14px;
    font-weight: bold;
    &:hover {
        background-color: #c0e890;
    }
`;

export const MedicalFileIcon = styled.span`
    display: inline-block;
    margin-left: 10px;
    background-color: #e0e0e0;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 12px;
    color: #333;
`;

export const TableContainer3 = styled.div`
    width: 100%;
    overflow-x: auto; // Allows horizontal scrolling on smaller screens
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 20px;
    border: 1px solid #e0e0e0;
`;

// Table element itself
export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    min-width: 600px; // Ensures table doesn't shrink too much
`;

// Table headers
export const TableHeader = styled.th`
    padding: 15px;
    text-align: left;
    font-size: 14px;
    font-weight: bold;
    color: #555;
    border-bottom: 2px solid #e0e0e0;
    white-space: nowrap; // Prevents text from wrapping

    @media (max-width: 768px) {
        font-size: 12px;
        padding: 10px;
    }
`;

// Table rows
export const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f9f9f9;
    }
`;

// Table data cells
export const TableData2 = styled.td`
    padding: 15px;
    font-size: 14px;
    color: #555;
    border-bottom: 1px solid #e0e0e0;
    white-space: nowrap; // Prevents text from wrapping

    @media (max-width: 768px) {
        font-size: 12px;
        padding: 10px;
    }
`;

// Styled component for special badges like "Biceps"
export const Badge = styled.span<BadgeProps>`
    display: inline-flex;
    align-items: center;
    padding: 5px 10px;
    background-color: ${({ status }) => getStatusColor(status || 'rest').background};
    color: ${({ status }) => getStatusColor(status || 'rest').color};
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
    white-space: nowrap;
    width: 94.32px;
    height: 25px;
    &::before {
        font-size: 20px;
        content: '•';
        display: inline-block;
        margin-right: 8px;
        color: ${({ status }) => getStatusColor(status || 'rest').dot};
    }

    @media (max-width: 768px) {
        font-size: 10px;
        padding: 3px 8px;
    }
`;

export const HealethWrap = styled.div.attrs({ className: '' })`
    display: flex;
    flex-direction: column;
    gap: 3rem;
    padding: 1rem; /* Added padding for better spacing */

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1.5rem; /* Reduced gap for smaller screens */
        padding: 0.5rem; /* Reduced padding for smaller screens */
    }
`;

export const InfoRowHealth = styled.div`
    width: 30%;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column; /* Stacked layout for smaller screens */
    font-size: 14px; /* Smaller font size for mobile */
    color: #555;

    @media (min-width: 769px) {
        width: 30%; /* Adjusted to full width on mobile */

        flex-direction: row; /* Row layout for larger screens */
        justify-content: space-between;
    }
`;

export const FileIcon = styled.div`
    left: 50%;
    position: absolute; /* Changed from absolute positioning */
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    color: #5b5b5b;
    font-size: 14px; /* Adjust font size for mobile */
    margin-top: 5px;

    &:hover {
        color: #000;
    }

    svg {
        margin-right: 4px;
    }

    @media (max-width: 768px) {
        left: 0%;
        width: 100px;
        position: relative; /* Changed from absolute positioning */
        margin-left: 0; /* Adjust margin for mobile */
    }
`;

export const TableFilterContainer3 = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

export const ReportButton = styled.button`
    padding: 10px 20px;
    background-color: #c0d330;
    color: #fff;

    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    &:hover {
        color: #fcfcfd;
        background-color: #000;
    }
`;

export const DocumentBox = styled.div`
    display: flex;
    align-items: center;
    padding: 16px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    width: 400px; /* Adjust as needed */
`;

export const Thumbnail = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 16px;
`;

export const DocumentInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const DocumentType = styled.div`
    font-weight: bold;
    font-size: 16px;
`;

export const LastUpdate = styled.div`
    font-size: 12px;
    color: #777;
`;

export const Actions = styled.div`
    display: flex;
    gap: 10px;
`;

export const ActionIcon = styled.div`
    font-size: 16px;
    color: #555;
    cursor: pointer;

    &:hover {
        color: #000;
    }
`;

export const documentsContainer = styled.div`
    margin-block-start: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    flex-direction: row;
`;
export const TableHeaderTitle = styled.div`
    color: #c0d330;
    font-size: 18px;
    font-weight: 500;
`;
export const DivWraperFlex = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;
export const DivWraperFlexCharts = styled.div`
    width: 49%;
`;
export const PlayerPageHeaderIformation = styled.div`
    display: flex;
    justify-content: space-between;
`;
export const AcademyInformation = styled.div`
    display: flex;
`;
export const PLayerInformation = styled.div`
    display: flex;
`;
export const ContractInfo = styled.div`
    display: flex;
    flex-direction: column;
`;
export const AcademyAndPlayerInfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;
export const SportSpan = styled.span`
    display: flex;
    font-size: 12px;
    padding: 3px 10px;
    color: #c0d330;
    background-color: #c0d33014;
`;
export const AcademySpan = styled.span`
    display: flex;
    font-size: 12px;
    padding: 3px 10px;
    color: #20240399;
`;
export const AgeGendarSpan = styled.span`
    display: flex;
    font-size: 12px;
    padding: 3px 10px;
    color: #20240399;
`;
export const NationalTeamSpan = styled.span`
    display: flex;
    font-size: 12px;
    padding: 3px 10px;
    color: #005430;
`;
export const PlayerNameSpan = styled.span`
    display: flex;
    font-size: 40px;
    font-weight: 700;
    padding: 3px 10px;
    color: #000;
`;

export const PlayerRoleSpan = styled.span`
    font-size: 12px;
    padding: 5px 10px;
    color: #dc259f;
    margin: auto;
    font-weight: 500;
    background-color: #dc259f0a;
`;

export const PlayerLevelSpan = styled.span`
    font-size: 12px;
    padding: 5px 10px;
    color: #dc7a25;
    margin: auto;
    font-weight: 500;
    background-color: #dc7a250a;
`;

export const ContractTitleSpan = styled.span`
    display: flex;
    font-size: 14px;
    font-weight: bold;
    padding: 3px 10px;
    color: #039855;
`;

export const ContractDateSpan = styled.span`
    display: flex;
    font-size: 12px;
    padding: 3px 10px;
    color: #20240399;
    font-weight: 400;
`;
export const SportPlayerDetails = styled.div`
    display: flex;
    flex-direction: column;
`;
export const Datalabel = styled.div`
    font-size: 12px;
    font-weight: 500;
    color: #2024034d;
`;
export const DataContant = styled.div`
    font-size: 20px;
    font-weight: 600;
    color: #202403d9;
`;
export const BoxStatus = styled.div`
    min-height: 146px;
    width: 100%;
    justify-content: space-between;
    align-items: baseline;
    flex-direction: row;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
`;
export const BoxWrapStatus = styled.div`
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
`;
export const ValueWrapStatus = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
`;
export const BoxLabelStatus = styled.div`
    text-align: justify;
    font-size: 16px;
    color: #c0d330;
    font-weight: 500;
`;
export const SpanDataFirst = styled.span`
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 10px;
    font-weight: 600;
    color: '#2024034d';
`;
export const SpanDataSecond = styled.span`
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 10px;
    font-weight: 600;
    color: '#2024034d';
    opacity: 0.5;
`;
export const SpanFooterDataDiv = styled.div`
    display: flex;
    justify-content: space-between;
`;
export const SpanFooterData = styled.div`
    color: '#2024034D';
    opacity: 0.5;
    padding: 0 5px;
    font-size: 12px;
    gap: 10px;
`;
export const HrLine = styled.hr`
    height: 20px;
    border: none;
    border-left: 1px solid #ccc;
`;
export const BoxContainer = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    @media ${media.md} {
        flex-direction: column;
    }
`;

export const BoxIcon = styled.div`
    font-size: 24px;
    color: #4a90e2;
    margin-bottom: 10px;
`;
export const ChartsContainer = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    padding-block: 50px;
    align-self: center;
    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    @media (max-width: 767px) {
        width: 100%;
        height: auto; /* Set height to auto to adapt to content */
    }

    .chart-wrapper {
        height: 500px; /* Set a fixed height for large screens */

        @media (max-width: 767px) {
            height: 250px; /* Reduce height for mobile screens */
        }
    }
`;
export const FormGroup = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-direction: row;
    margin-bottom: 1rem;
    flex-wrap: wrap;

    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

export const FormLabel = styled.label`
    margin-bottom: 0.5rem;
    font-weight: bold;
`;

export const FormInput = styled.input`
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 150px; // Adjust width as needed
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
