import styled from 'styled-components';
import { Image as DefaultImage } from 'components';

export const AthletesList = styled.div.attrs({
    className:
        'grid grid-cols-[20%_15%_15%_auto] my-[30px] gap-y-[20px] gap-x-[30px] p-[0px_80px_0px_0px] capitalize',
})``;

export const AthletesLabelBody = styled.div.attrs({
    className:
        'grid grid-cols-[30%_20%_20%] my-[30px] gap-y-[20px] gap-x-[30px] p-[0px_80px_0px] capitalize',
})``;

export const AthletesStateList = styled.div.attrs({
    className:
        'grid grid-cols-[15%_15%_15%_15%_auto] my-[30px] gap-y-[20px] gap-x-[30px] p-[0px_80px_0px_0px] capitalize',
})``;
export const ListHeader = styled.div.attrs({ className: 'font-[600] text-[18px] capitalize' })``;

export const ListAthleteWrapper = styled.div.attrs({
    className: 'flex justify-start items-center gap-[15px] mb-auto',
})``;

export const ListAvatar = styled(DefaultImage).attrs({
    className: 'w-[50px] rounded-full',
})``;

export const ListAthleteName = styled.p.attrs({ className: 'text-[18px]' })``;

export const AbsentAthleteLabel = styled.span`
    color: #000;
    font-weight: bold;

    opacity: 0.5;
    user-select: none;
`;
