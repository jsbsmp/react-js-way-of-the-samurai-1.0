export type FiledValidatorType = (value: string) => string | undefined;

export const required: FiledValidatorType = (value) => {
    if (value) return undefined;
    return "Field is required";
}

export const maxLengthCreator = (maxLength: number): FiledValidatorType => (value) => {
    if (value && value.length > maxLength) return `Must be ${maxLength} characters or less`;
    return undefined;
}

export const minLengthCreator = (minLength: number): FiledValidatorType => (value) => {
    if (value && value.length < minLength) return `Must be at least ${minLength} characters`;
    return undefined;
}