import React from 'react';
import {
    CardContainer,
    Header,
    Title,
    PrintButton,
    Content,
    DocumentImage,
    Footer,
    ButtonGroup,
    ActionButton,
} from './Theme';
import { useLocales } from 'hooks/locales';

interface DocumentCardProps {
    doc: { documentUrl: string; signedUrl: string; type: string; updatedAt?: string };
}

const DocumentCard: React.FC<DocumentCardProps> = ({ doc }) => {
    const { trans } = useLocales();

    const handlePrint = async () => {
        if (!doc?.documentUrl && !doc?.signedUrl) {
            alert('Document URL not available.');
            return;
        }

        // Extract file extension
        const fileExtension = doc.documentUrl.split('.').pop()?.split('?')[0]?.toLowerCase();

        // Printable file types
        const printableTypes = ['pdf', 'png', 'jpg', 'jpeg', 'gif'];

        if (fileExtension && printableTypes.includes(fileExtension)) {
            // Load in iframe for direct printing
            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = 'none';
            iframe.src = doc.documentUrl || doc.signedUrl;

            document.body.appendChild(iframe);

            iframe.onload = () => {
                iframe.contentWindow?.print();
                document.body.removeChild(iframe);
            };
        } else {
            // Use Google Docs Viewer for unsupported formats
            const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
                doc.documentUrl || doc.signedUrl,
            )}&embedded=true`;

            const newWindow = window.open(googleViewerUrl, '_blank');
            if (newWindow) {
                newWindow.focus();
            } else {
                alert(
                    'Unable to open document for printing. Please disable your popup blocker and try again.',
                );
            }
        }
    };

    const handleDelete = () => {
        alert('Document deleted.');
    };

    const handleDownload = async () => {
        if (!doc?.documentUrl && !doc?.signedUrl) {
            alert('Document URL not available.');
            return;
        }

        // Trigger file download
        const link = document.createElement('a');
        link.href = doc.documentUrl || doc.signedUrl;
        link.download = `${doc.type}.${
            doc.documentUrl || doc.signedUrl.split('.').pop()?.split('?')[0] || 'file'
        }`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <CardContainer>
            <Content>
                <PrintButton onClick={handlePrint} title="Print">
                    <img src="/assets/icons/printer.svg" alt="edit" height={24} width={24} />
                </PrintButton>
                <DocumentImage
                    src={`https://placehold.co/350x200?text=${doc.type}`}
                    alt={doc.type}
                />
            </Content>
            <Footer>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Header>
                        <Title>{doc.type}</Title>
                    </Header>
                    <span>
                        {trans('coach.profile.Edit.lastUpdatedDate')}:{' '}
                        {doc?.updatedAt?.split('T')[0]}
                    </span>
                </div>
                <ButtonGroup>
                    <ActionButton onClick={handleDownload}>
                        <img
                            src="/assets/icons/document-download.svg"
                            alt="edit"
                            height={24}
                            width={24}
                        />
                    </ActionButton>
                    <ActionButton onClick={handleDelete}>
                        <img src="/assets/icons/delete.svg" alt="edit" height={24} width={24} />
                    </ActionButton>
                </ButtonGroup>
            </Footer>
        </CardContainer>
    );
};

export default DocumentCard;
