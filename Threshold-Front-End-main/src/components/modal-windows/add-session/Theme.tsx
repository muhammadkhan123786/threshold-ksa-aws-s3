import styled from 'styled-components';

export const AthletesList = styled.div.attrs({
    className:
        'grid grid-cols-[20%_20%_auto] my-[30px] gap-y-[20px] gap-x-[30px] p-[0px_80px_0px_0px]',
})``;

export const ListHeader = styled.div.attrs({ className: 'font-[600] text-[18px]' })``;

export const ListAthleteWrapper = styled.div.attrs({
    className: 'flex justify-start items-center gap-[15px] mb-auto',
})``;

export const ListAvatar = styled.img.attrs({
    className: 'w-[50px] h-[50px] rounded-full',
})``;

export const ListAthleteName = styled.p.attrs({ className: 'text-[18px]' })``;
