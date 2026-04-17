export const SUCCESS_STATUS = [200, 201, 202, 203];
export const PUBLIC_ROUTES = [
    'signin',
    'signup',
    'forget_password',
    'reset_password',
    'athlete_public',
    'athlete_public_with_club',
];
export const CONFIG_ROUTES = ['/auth/login', '/auth/register'];

export const userRoleMapping: { [key: string]: string } = {
    'academy-admin': 'Admin',
    'academy-marketer': 'Marketer',
};
