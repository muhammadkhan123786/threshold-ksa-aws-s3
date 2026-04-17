import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import styled from 'styled-components';

interface CardItem {
    title: string;
    value: string;
    imageSrc?: string;
}

interface CardProps {
    items: CardItem[];
    onUpdate: () => void;
}

export const Card = ({ items, onUpdate }: CardProps) => {
    const { trans } = useLocales();
    const Avatar = styled.img.attrs({
        className: 'w-5 h-5 md:w-8 md:h-8 mb-2 md:mb-0',
    })`
        width: 1rem !important;
        height: 1rem !important;
        @media (max-width: 767px) {
            width: 2rem !important;
            height: 2rem !important;
        }
    `;
    return (
        <Theme.CardBody className="flex flex-col md:flex-row items-center justify-between border border-[#C0D330] rounded-[11.2px] m-2 w-full py-[28px] md:py-[48px] px-[20px] md:px-[32px]">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-x-6 md:space-y-0 flex-grow">
                {items.map((item, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                        <Theme.CardCellBody>
                            <Theme.CardTitleBody className="flex flex-col md:flex-row justify-center items-center text-[14px] md:text-[16px]">
                                {item?.imageSrc && (
                                    <Avatar
                                        src={item.imageSrc}
                                        alt={`${item.title} Icon`}
                                        className="w-5 h-5 md:w-8 md:h-8 mb-2 md:mb-0"
                                    />
                                )}
                                <Theme.CardTitle className="text-sm md:text-base font-bold justify-center items-center flex mt-2 md:mt-0 md:ms-2 uppercase">
                                    {item.title}
                                </Theme.CardTitle>
                            </Theme.CardTitleBody>
                            <Theme.CardValue className="text-sm md:text-base mt-[10px] md:mt-[16px]">
                                {item.value}
                            </Theme.CardValue>
                        </Theme.CardCellBody>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center md:justify-end w-full md:w-auto mt-6 md:mt-0">
                <Theme.Button
                    className="ml-0 md:ml-4"
                    style={{
                        width: 'fit-content',
                        height: 'fit-content',
                        fontSize: '16px',
                        padding: '10px 20px',
                    }}
                    onClick={onUpdate}
                >
                    {trans('athlete.update')}
                </Theme.Button>
            </div>
        </Theme.CardBody>
    );
};
