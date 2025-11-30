import React, { useState } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallback?: string;
}

export const Image: React.FC<ImageProps> = ({
                                                src,
                                                alt,
                                                fallback = '/placeholder.png',
                                                className = '',
                                                ...props
                                            }) => {
    const [imgSrc, setImgSrc] = useState(src);

    const handleError = () => {
        setImgSrc(fallback);
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            onError={handleError}
            className={className}
            {...props}
        />
    );
};
