import React, { useEffect } from 'react';

const withScript = (WrappedComponent: React.ComponentType, scriptSrc: string) => {
    return (props: any) => {
        useEffect(() => {
            const script = document.createElement('script');
            script.src = scriptSrc;
            script.async = true;

            document.head.appendChild(script);

            return () => {
                document.head.removeChild(script);
            };
        }, []);

        return <WrappedComponent {...props} />;
    };
};

export default withScript;