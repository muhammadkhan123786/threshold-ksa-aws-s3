import * as Theme from './Theme';

interface FormHeaderProps {
    label: string;
    marginTop?: string;
}

export const FromHeader = ({ label, marginTop }: FormHeaderProps) => {
    return (
        <Theme.FormHeaderWrapper marginTop={marginTop}>
            <Theme.Logo src="/assets/icons/login-logo.png" alt="logo" />
            <Theme.FormTitle variant="h2" value={label} />
        </Theme.FormHeaderWrapper>
    );
};
