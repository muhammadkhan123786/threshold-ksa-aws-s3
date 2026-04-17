import { AthleteStatus, SubscriptionStatus } from 'libs/enums';
import { Athlete } from 'libs/types';
import moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
export const calculateYearsDifference = (startDate: Date, endDate: Date): number => {
    const millisecondsDifference = Math.abs(endDate.getTime() - startDate.getTime());
    const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;
    const yearsDifference = Math.floor(millisecondsDifference / millisecondsInYear);

    return yearsDifference;
};

export const checkIsAfterAge18 = (dateOfBirth: string): boolean => {
    if (!dateOfBirth) return false;
    const birthDate = moment(dateOfBirth);
    const age = moment().diff(birthDate, 'years');
    return age >= 18;
};

export const getActiveAthletes = (athletes: Athlete[]) => {
    const initialCounts = { activeAthletes: 0, inActiveAthletes: 0 };

    const { activeAthletes, inActiveAthletes } = athletes.reduce((prev, current) => {
        const isActiveProfile =
            current.athleteProfiles?.some((profile) => profile.status === AthleteStatus.ACTIVE) ??
            false;
        const isActiveSubscription = current.subscription?.status === SubscriptionStatus.ACTIVE;
        const isActive = isActiveProfile && isActiveSubscription;

        return {
            activeAthletes: prev.activeAthletes + (isActive ? 1 : 0),
            inActiveAthletes: prev.inActiveAthletes + (!isActive ? 1 : 0),
        };
    }, initialCounts);

    return { activeAthletes, inActiveAthletes };
};

export const getScaleExertion = (scale: string): string => {
    if (['0', '00'].includes(scale)) return 'rest';
    if (['1', '01'].includes(scale)) return 'veryEasy';
    if (['2', '02'].includes(scale)) return 'easy';
    if (['3', '03'].includes(scale)) return 'moderate';
    if (['4', '04'].includes(scale)) return 'somewhatHard';
    if (['5', '6', '05', '06'].includes(scale)) return 'hard';
    if (['7', '8', '9', '07', '08', '09'].includes(scale)) return 'veryHard';
    if (['10'].includes(scale)) return 'maximal';
    else return 'none';
};

export const addMonths = (date: Date, months: number) => {
    date.setMonth(date.getMonth() + months);
    return date;
};

export const exportPDF = (athleteName: string) => {
    const input = document.getElementById('table-to-export');
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const pdfFileName = `Health_Records_Report_${athleteName}_${currentDate}.pdf`; // Professional name

    if (!input) {
        console.error('Table element not found');
        return;
    }
    const buttons = input.querySelectorAll('button');
    buttons.forEach((button) => (button.style.display = 'none'));

    // Add class to hide elements
    input.classList.add('hidden-elements');

    html2canvas(input)
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            // Background image containing header and footer
            const backgroundImage =
                'https://i.ibb.co/r3c3HJH/c313e07d-ab36-4732-b2a4-a7fb43e2e397.jpg'; // Replace with your background image URL
            const backgroundImageWidth = 210; // Width of the image in mm
            const backgroundImageHeight = 295; // Height of the image in mm
            const contentOffsetY = 40;
            // Add background image to the PDF
            pdf.addImage(backgroundImage, 'PNG', 0, 0, backgroundImageWidth, backgroundImageHeight);

            // Add the main content image
            pdf.addImage(imgData, 'PNG', 0, contentOffsetY, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                pdf.addPage();
                // Add background image to each new page
                pdf.addImage(
                    backgroundImage,
                    'PNG',
                    0,
                    0,
                    backgroundImageWidth,
                    backgroundImageHeight,
                );
                pdf.addImage(imgData, 'PNG', 0, -heightLeft, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(pdfFileName);

            // Remove class to restore elements
            input.classList.remove('hidden-elements');
            buttons.forEach((button) => (button.style.display = ''));
        })
        .catch((error) => {
            console.error('Error generating PDF:', error);

            // Remove class in case of error as well
            input.classList.remove('hidden-elements');
        });
};

export const exportRowPDF = (rowElement: HTMLElement, fileName: string) => {
    html2canvas(rowElement)
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const footerHeight = 20; // Height of the footer in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            const backgroundImage =
                'https://i.ibb.co/r3c3HJH/c313e07d-ab36-4732-b2a4-a7fb43e2e397.jpg'; // Replace with the actual path to your logo
            const backgroundImageWidth = 210; // Width of the image in mm
            const backgroundImageHeight = 295; // Height of the image in mm
            const contentOffsetY = 40;
            pdf.addImage(backgroundImage, 'PNG', 0, 0, backgroundImageWidth, backgroundImageHeight);
            pdf.addImage(imgData, 'PNG', 0, contentOffsetY, imgWidth, imgHeight);

            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                pdf.addPage();
                pdf.addImage(
                    backgroundImage,
                    'PNG',
                    0,
                    0,
                    backgroundImageWidth,
                    backgroundImageHeight,
                );
                pdf.addImage(imgData, 'PNG', 0, -heightLeft, imgWidth, imgHeight);
                heightLeft -= pageHeight - footerHeight;
            }

            pdf.save(fileName); // Use professional file name
        })
        .catch((error) => {
            console.error('Error generating PDF:', error);
        });
};
