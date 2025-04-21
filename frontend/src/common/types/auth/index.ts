import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"

export interface IPropsLogin<
    TFieldValues extends FieldValues = FieldValues,
    TContext = any,
    TTransformedValues extends FieldValues | undefined = undefined,
    >  {
    navigate: (to: string) => void
    register: UseFormRegister<TFieldValues>
    errors: FieldErrors<TFieldValues>
}

export interface IPropsRegister <
    TFieldValues extends FieldValues = FieldValues,
    TContext = any,
    TTransformedValues extends FieldValues | undefined = undefined,
    >  {
    navigate: (to: string) => void
    register: UseFormRegister<TFieldValues>
    errors: FieldErrors<TFieldValues>
}

export interface IAuthState {
    token: string,
    qrCode: string,
    isLogged: boolean,
    isLoading: boolean
}

export interface ILoginData {
    email: string
    password: string
    secondFactor: string
}

export interface IRegisterData {
    email: string
    password: string
}

