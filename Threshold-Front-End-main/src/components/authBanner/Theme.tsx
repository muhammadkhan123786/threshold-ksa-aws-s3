import styled from 'styled-components';
import { Image as DefaultImage, Text as DefaultText } from 'components';
import { mq } from 'theme/mq';

export const Body = styled.div.attrs({
    className: 'flex flex-col justify-center relative',
})`
    width: 100%;
    color: #fff;
    gap: 42px;
    justify-content: flex-end;
    @media (${mq.tablet}) {
        // padding: 100px 10vw;
    }

    @media (${mq.laptop}) {
        height: 100%;
        width: 60%;
    }
`;

export const DarkBacklight = styled.div`
    background-image: url('/assets/images/auth-bg.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    filter: brightness(50%);
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: -1;
`;

export const LoginBackGround = styled.div`
    background-image: url('/assets/images/login-bg.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: absolute;
    height: 100%;
    width: 100%;
`;

export const Logo = styled(DefaultImage)`
    width: 100px;
    height: auto;
    margin-bottom: 50px;

    @media (${mq.laptop}) {
        width: 300px;
    }
`;

export const BrandMessageWrapper = styled.div`
    padding-bottom: 40px;
    display: flex;
    width: 70%;
`;

export const BrandLogoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-self: end;
`;

export const Quote = styled(DefaultText)<{ right?: boolean }>`
    transform: ${(props) =>
        props.right ? 'rotateX(180deg)' : 'translateY(-30px) rotateZ(180deg)'};
    align-self: ${(props) => (props.right ? 'end' : 'start')};
    font-size: 20px;
    font-family: 'Passion One', sans-serif;
    color: #fdfefb99;
    height: fit-content;
    line-height: 0px;
`;

export const BrandMessage = styled(DefaultText)`
    opacity: 0.8;
    text-align: center;
    width: 70%;

    @media (${mq.tablet}) {
        width: 100%;
    }
`;
