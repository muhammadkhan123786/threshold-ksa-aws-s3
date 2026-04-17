import { Consideration, Nationality, Education, Gender, YesNo, Relationship } from 'libs/enums';
import * as yup from 'yup';

const EMPTY_STATIC_VALUES = {
    firstName: '',
    lastName: '',
    avatar: '',
    contact: '',
    dateOfBirth: new Date('01/01/2000').toLocaleDateString(),
    joinDate: new Date().toLocaleDateString(),
    nin: '',
    dateOfUpdating: new Date().toLocaleDateString(),
    team: '',
    position: '',
    age: 0,
    chronic: [],
};

export const ATHLETE_INITIAL_FORM_VALUES: {
    selections: {
        field: any;
        enumValue: string;
        transValue: string;
    }[];
    statics: {
        empty: any;
    };
} = {
    selections: [
        {
            field: 'relationship',
            enumValue: Relationship.FATHER,
            transValue: 'form.editAthleteProfile.father',
        },
        {
            field: 'nationality',
            enumValue: Nationality.SA,
            transValue: 'form.editAthleteProfile.sa',
        },
        {
            field: 'education',
            enumValue: Education.PRIMARY,
            transValue: 'form.editAthletePersonalInfo.primary',
        },
        {
            field: 'gender',
            enumValue: Gender.MALE,
            transValue: 'global.male',
        },
        {
            field: 'allergies',
            enumValue: YesNo.NO,
            transValue: 'form.editMedicalInfo.no',
        },
        {
            field: 'injury',
            enumValue: YesNo.NO,
            transValue: 'form.editMedicalInfo.no',
        },
        {
            field: 'consideration',
            enumValue: Consideration.NONE,
            transValue: 'form.editMedicalInfo.none',
        },
    ],
    statics: { empty: EMPTY_STATIC_VALUES },
};

export const SingleSelectOption = {
    label: yup.string(),
    value: yup.string(),
};

export const getAvatarPlaceholder = (gender: Gender = Gender.MALE) =>
    gender === Gender.MALE ? '/assets/images/avatar-male.jpg' : '/assets/images/avatar-female.jpg';

export const CHRONIC_DISEASES = [
    'coronary_artery_disease',
    'hypertension',
    'copd',
    'asthma',
    'interstitial_lung_disease',
    'type_1_diabetes',
    'type_2_diabetes',
    'alzheimers_disease',
    'parkinsons_disease',
    'multiple_sclerosis',
    'rheumatoid_arthritis',
    'lupus',
    'chronic_kidney_disease',
    'ibd',
    'ibs',
    'depression',
    'anxiety_disorders',
    'bipolar_disorder',
    'osteoporosis',
    'obesity',
];

export const BATTERY_DATE_THRESHOLD = [1, 2, 1, 4, 3];
