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
    user: IPublicUser,
    isLogged: boolean
}

interface IPublicUser {
    id: number | null,
    email: string,
    tasks: [ITasks]
}

interface ITasks {
    id: number | null,
    name: string,
    date: string
}

