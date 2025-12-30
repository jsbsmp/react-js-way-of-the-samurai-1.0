import { WrappedFieldMetaProps } from './../../../../node_modules/@types/redux-form/lib/Field.d';
import { Field, WrappedFieldProps } from 'redux-form';
import styles from './FormControls.module.css';
import { FiledValidatorType } from '../../../utils/validators/validators';
import React from 'react';

type FormControlPropsType = {
    meta: WrappedFieldMetaProps,
    children: React.ReactNode
}

const FormControl: React.FC<FormControlPropsType> = ({ meta: { touched, error }, children }) => {
    const hasError = touched && error;
    return (
        <div className={styles.formControl + " " + (hasError ? styles.error : "")}>
            <div>
                {children}
            </div>
            {hasError && <span>{error}</span>}
        </div>
    )
}

export const Textarea: React.FC<WrappedFieldProps> = (props) => {
    const { input, meta, ...restProps } = props;
    return (
        <FormControl {...props} children={<textarea {...input} {...restProps} />} />
    )
}

export const Input: React.FC<WrappedFieldProps> = (props) => {
    const { input, meta, ...restProps } = props;
    return (
        <FormControl {...props} children={<input {...input} {...restProps} />} />
    )
}

export function createField<FormKeysType extends string>(placeholder: string | undefined, name: FormKeysType, validators: Array<FiledValidatorType>, component: React.FC<WrappedFieldProps>, props = {}, text = "") {
    return <div>
        <Field placeholder={placeholder} name={name} validate={validators} component={component} {...props} /> {text}
    </div>
}

export type GetStringKeys<T> = Extract<keyof T, string>;