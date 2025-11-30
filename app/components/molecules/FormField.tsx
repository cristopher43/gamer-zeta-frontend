import React from 'react';
import { Input } from '~/components/atoms/Input';
import { Label } from '~/components/atoms/Label';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
                                                        label,
                                                        error,
                                                        id,
                                                        required,
                                                        ...props
                                                    }) => {
    return (
        <div className="mb-4">
            <Label htmlFor={id} required={required}>
                {label}
            </Label>
            <Input id={id} error={error} {...props} />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};
