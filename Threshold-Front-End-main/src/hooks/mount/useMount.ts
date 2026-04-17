import { useEffect, useState } from 'react';

export const useMount = () => {
    const [isMount, setMount] = useState(true);
    useEffect(() => {
        setMount(false);
    }, []);

    return isMount;
};
