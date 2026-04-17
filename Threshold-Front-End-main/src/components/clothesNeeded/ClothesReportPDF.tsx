import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface Size {
    size: string;
    quantity: number;
}
interface ClothesNeededItem {
    category: string;
    sizes: Size[];
}

interface ClothesNeededData {
    total: number;
    clothesNeeded: ClothesNeededItem[];
}
interface ClothesReportPDFProps {
    data: ClothesNeededData;
    trans: (key: string) => string;
    sport: string;
}

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#C0D330',
    },
    headWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    subHeadWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    logo: {
        width: '48px',
        height: '32px',
    },
    logoTitle: {
        width: '150px',
        height: '25px',
    },
    subHeaderLogo: {
        width: '20px',
        height: '20px',
    },
    subTitle: {
        fontSize: 10,
        marginTop: 10,
        marginBottom: 5,
        color: '#141400',
        fontWeight: 500,
    },
    subHeaderTitle: {
        fontSize: 15,
        marginTop: 10,
        marginBottom: 5,
        color: '#141400',
        fontWeight: 500,
    },
    subHeaderTotal: {
        fontSize: 15,
        marginTop: 10,
        marginBottom: 5,
        color: '#EB5353',
        fontWeight: 500,
    },
    sportTitle: {
        fontSize: 8,
        marginBottom: 5,
        color: '#202403D9',
        fontWeight: 400,
    },
    total: {
        fontSize: 14,
        marginBottom: 20,
    },
    category: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    sizes: {
        fontSize: 12,
        marginBottom: 10,
    },
    bodyWrapper: {
        border: '1px solid #DBDDD0',
        borderRadius: '8px',
        padding: '16px 20px',
    },
    rowWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    divider: {
        backgroundColor: '#DBDDD0',
        height: '1px',
        marginBottom: 10,
    },
    sizeText: {
        color: '#039855',
        fontWeight: 500,
        fontSize: 16,
    },
    sizeUnit: {
        color: '#202403D9',
        fontWeight: 500,
        fontSize: 16,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        fontSize: 10,
        color: '#20240399',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
    },
});

export const ClothesReportPDF = ({ data, trans, sport }: ClothesReportPDFProps) => {
    const formatDate = () => {
        const date = new Date();
        return `${date.getDate().toString().padStart(2, '0')}${date.toLocaleString('en-US', {
            month: 'short',
        })},${date.getFullYear()}`;
    };
    const year = () => {
        const date = new Date();
        return date.getFullYear();
    };
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* START SUB HEADER */}
                <View style={styles.headWrapper}>
                    {/* Left side group (logo + titles) */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <View style={styles.logo}>
                            <Image src="/assets/icons/logoPDF.png" style={styles.logo} />
                        </View>
                        <View>
                            <Text style={styles.subTitle}>Clothes Section Report</Text>
                            <Text style={styles.sportTitle}>Sport: {sport}</Text>
                        </View>
                    </View>

                    {/* Right side logo */}
                    <View>
                        <Image src="/assets/icons/titlePDF.png" style={styles.logoTitle} />
                    </View>
                </View>
                {/* END SUB HEADER */}

                {/* START SUB HEADER */}
                <View style={styles.subHeadWrapper}>
                    {/* Left side group (logo + titles) */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                        <View>
                            <Image src="/assets/icons/shirtPDF.png" style={styles.subHeaderLogo} />
                        </View>
                        <View>
                            <Text style={styles.subHeaderTitle}>Clothes Needed</Text>
                        </View>
                    </View>

                    {/* Right side logo */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                        <View>
                            <Text style={styles.subHeaderTotal}>Total: 33</Text>
                        </View>

                        <View>
                            <Image src="/assets/icons/totalPDF.png" style={styles.subHeaderLogo} />
                        </View>
                    </View>
                </View>
                {/* END SUB HEADER */}
                <View style={styles.bodyWrapper}>
                    {data.clothesNeeded.map((item, index) => (
                        <View key={index}>
                            <View style={styles.rowWrapper}>
                                <Text style={styles.category}>{item.category}:</Text>
                                <Text style={styles.sizes}>
                                    {item.sizes.map((size, sizeIndex) => (
                                        <Text key={sizeIndex} style={styles.sizeText}>
                                            {size.quantity}
                                            <Text style={styles.sizeUnit}>{size.size}</Text>
                                        </Text>
                                    ))}
                                </Text>
                            </View>
                            {index !== data.clothesNeeded.length - 1 && (
                                <View style={styles.divider}></View>
                            )}
                        </View>
                    ))}
                </View>

                <View style={styles.footer}>
                    <View>
                        <Text>{`@${year()}, Threshold Technologies`}</Text>
                    </View>
                    <View>
                        <Text>{formatDate()}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
