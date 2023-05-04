import styled from 'styled-components';
import lottie from 'lottie-web';
import { useEffect, useRef } from 'react';


const LoaderContainer = styled.div`
    width: 80%;
    height: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    @media (max-width: 768px) {
        width: 100%;
        height: 100%;
    }`;
import loaderAnim from '../../assets/loader.json';
const Loader = (load: boolean) => {
    const container = useRef(null)
    useEffect(() => {
        lottie.loadAnimation({
            container: container.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: loaderAnim,
        });

    }, []);
    if (!load) return;
    return <LoaderContainer ref={container} />;
}

export default Loader;
