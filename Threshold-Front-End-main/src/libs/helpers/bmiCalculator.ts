import { bmiData } from 'libs/constants';
import { AthleteBiometricStatus, Gender } from 'libs/enums';

export const generateZPercent = (z: number) => {
    if (z < -4) {
        return 0.0;
    }

    if (z > 4) {
        return 1.0;
    }

    let factK = 1;
    let sum = 0;
    let term = 1;
    let k = 0;
    let loopStop = Math.exp(-23);

    while (Math.abs(term) > loopStop) {
        term =
            (((0.3989422804 * Math.pow(-1, k) * Math.pow(z, k)) / (2 * k + 1) / Math.pow(2, k)) *
                Math.pow(z, k + 1)) /
            factK;
        sum += term;
        k++;
        factK *= k;
    }

    sum += 0.5;

    return sum;
};

export const generateBmiMetric = (kgs: number, meters: number, gender: Gender, agem: number) => {
    agem = Math.min(Math.round(agem), 239);

    const sex = gender === Gender.MALE ? '1' : '2';

    const calcBmiObj = {
        bmi: -1,
        percentile: 0,
        percentileRaw: -1,
        overP95: 0,
        M: 0,
        Z: 0,
    };

    // bmi
    const bmi = kgs / (meters * meters);
    calcBmiObj.bmi = Math.round(bmi * 100) / 100;

    // Get the correct item from the bmi data
    const bmiDataItem = bmiData.find((item) => {
        return item.Sex === sex && agem + 0.5 === parseFloat(item.Agemos);
    });
    if (!bmiDataItem) {
        return calcBmiObj;
    }

    const L = parseFloat(bmiDataItem.L);
    const M = parseFloat(bmiDataItem.M);
    const S = parseFloat(bmiDataItem.S);

    // Median
    calcBmiObj.M = M;

    // bmiZ calc
    const bmiZ = (Math.pow(bmi / M, L) - 1) / (S * L);
    calcBmiObj.Z = bmiZ;

    // Percentile calc
    const percentileRaw = generateZPercent(bmiZ);
    const percentile = Number((percentileRaw * 100).toFixed(2));
    calcBmiObj.percentile = percentile;
    calcBmiObj.percentileRaw = percentileRaw;

    if (percentileRaw > 0.97) {
        // Data from bmiData table
        const p95 = parseFloat(bmiDataItem.P95);

        // Calculate over percent
        const overP95 = Math.round((100 * bmi) / p95);

        calcBmiObj.overP95 = overP95;
    }

    return calcBmiObj;
};

const getBmiStatus = (p: number) => {
    if (p < 5) {
        return AthleteBiometricStatus.UNDER_WEIGHT;
    } else if (p < 85) {
        return AthleteBiometricStatus.HEALTHY;
    } else if (p < 95) {
        return AthleteBiometricStatus.OVER_WEIGHT;
    } else {
        return AthleteBiometricStatus.OBESE;
    }
};

export const calculateBmi = ({
    weight,
    height,
    age,
    gender,
}: {
    weight: number;
    height: number;
    age: number;
    gender: Gender;
}): { status: AthleteBiometricStatus; bmi: number; bmiPercentile: number } => {
    const bmi = weight / (height * height);
    const p = generateBmiMetric(weight, height, gender, age * 12).percentile;

    return {
        bmi,
        bmiPercentile: p,
        status: getBmiStatus(p),
    };
};
