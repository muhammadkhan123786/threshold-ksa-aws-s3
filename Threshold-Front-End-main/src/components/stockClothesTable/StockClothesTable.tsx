import React, { useState } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { StockSizeModal } from 'components/stockSizeModal';
import { stringToDateString } from 'libs/helpers';

interface TemplatesTableProps {
    columns: string[];
    data: any;
    total: number;
}

export const StockClothesTable: React.FC<TemplatesTableProps> = ({ columns, data, total }) => {
    const { trans } = useLocales();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [showAll, setShowAll] = useState(false);
    const getRandomColor = () => {
        const colors = ['#6941C614', '#175CD314', '#3538CD14', '#34405414'];

        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const darkenColor = (hexColor: string) => {
            const hex = hexColor.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);

            const darkenFactor = 0.6;
            const darkenedColor = `#${
                (1 << 24) |
                ((Math.max(0, r * darkenFactor) & 0xff) << 16) |
                ((Math.max(0, g * darkenFactor) & 0xff) << 8) |
                (Math.max(0, b * darkenFactor) & 0xff)
            }`.slice(1);

            return `#${darkenedColor}`;
        };

        const darkerColor = darkenColor(randomColor.replace(/14$/, ''));
        return { randomColor, darkerColor };
    };

    const handleEditClick = (row: any) => {
        setSelectedRow(null);
        setIsModalOpen(true);
        setSelectedRow(row);
    };
    const handleAddClick = () => {
        setSelectedRow(null);
        setIsModalOpen(true);
    };
    const handleCloseClick = () => {
        setSelectedRow(null);
        setIsModalOpen(false);
    };

    return (
        <Theme.TableWrapper>
            <StockSizeModal
                isOpen={isModalOpen}
                onClose={() => handleCloseClick()}
                dataFromTable={selectedRow}
            />
            <Theme.StatusBar>
                <Theme.ParaAndButtonWrapper>
                    <Theme.ParaPurchaseHistory>
                        <span>{trans('stockclothes.purchase.history')}</span>
                        <Theme.UsersNumberTable>
                            {trans('table.all')}
                            {`(${total})`}
                        </Theme.UsersNumberTable>
                    </Theme.ParaPurchaseHistory>
                    <Theme.ButtonsWrapper onClick={handleAddClick}>
                        <img
                            src="/assets/icons/add-icon-colored.svg"
                            alt="Add"
                            height={16}
                            width={16}
                        />
                        {trans('add.new.clothes')}
                    </Theme.ButtonsWrapper>
                </Theme.ParaAndButtonWrapper>
            </Theme.StatusBar>

            <table style={{ width: '98%' }}>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <Theme.TableHeader key={column}>{column}</Theme.TableHeader>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data?.map((row: any) => (
                        <Theme.TableRow key={row?.id}>
                            <Theme.TableCell>{stringToDateString(row?.createdAt)}</Theme.TableCell>
                            <Theme.TableCell>
                                <Theme.PersonName>
                                    {trans(`row.category.${row?.category?.categoryName}`)}:
                                    {row?.totalQuantity}
                                </Theme.PersonName>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <Theme.ClothesMissingWrapper>
                                    {row?.sizeOptions.slice(0, 5).map((item: any) => {
                                        const { randomColor, darkerColor } = getRandomColor();
                                        return (
                                            <Theme.ParaMissingClothes
                                                key={`${item?.size}-${item?.quantity}`}
                                                style={{
                                                    backgroundColor: randomColor,
                                                    borderRadius: '12px',
                                                    margin: '0px 5px',
                                                    padding: '4px 6px',
                                                    fontWeight: '600',
                                                    minWidth: '80px',
                                                }}
                                            >
                                                <span style={{ opacity: '0.5' }}>
                                                    {item?.size} - {item?.quantity}
                                                </span>
                                            </Theme.ParaMissingClothes>
                                        );
                                    })}

                                    {row?.sizeOptions.length > 5 && !showAll && (
                                        <Theme.ParaMissingClothes
                                            style={{
                                                backgroundColor: 'transparent',
                                                color: '#039855',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                padding: '4px 6px',
                                                fontWeight: '600',
                                            }}
                                            onClick={() => setShowAll(true)}
                                        >
                                            {row?.sizeOptions.length - 5}
                                            {trans('sizes.remaining')}
                                        </Theme.ParaMissingClothes>
                                    )}

                                    {showAll &&
                                        row?.sizeOptions.slice(5).map((item: any) => {
                                            const { randomColor, darkerColor } = getRandomColor();
                                            return (
                                                <Theme.ParaMissingClothes
                                                    key={`${item?.size}-${item?.quantity}`}
                                                    style={{
                                                        backgroundColor: randomColor,
                                                        borderRadius: '12px',
                                                        margin: '0px 5px',
                                                        padding: '4px 6px',
                                                        fontWeight: '600',
                                                    }}
                                                >
                                                    <span style={{ opacity: '0.5' }}>
                                                        {item?.size} - {item?.quantity}
                                                    </span>
                                                </Theme.ParaMissingClothes>
                                            );
                                        })}
                                </Theme.ClothesMissingWrapper>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <Theme.PersonInfoElement>
                                    <button onClick={() => handleEditClick(row)}>
                                        <img
                                            src="/assets/icons/edit.svg"
                                            key={row?.id}
                                            alt={row?.name}
                                            height={24}
                                            width={24}
                                        />
                                    </button>
                                    <button onClick={() => console.log('click')}>
                                        <img
                                            src="/assets/icons/download-icon.svg"
                                            key={row?.id}
                                            alt={row?.name}
                                            height={24}
                                            width={24}
                                        />
                                    </button>
                                </Theme.PersonInfoElement>
                            </Theme.TableCell>
                        </Theme.TableRow>
                    ))}
                </tbody>
            </table>
        </Theme.TableWrapper>
    );
};
