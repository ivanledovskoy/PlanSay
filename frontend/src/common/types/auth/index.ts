export interface IPropsLogin {
    setEmail: (value: string) => void
    setPassword: (value: string) => void
    setSecondFactor: (value: string) => void
    navigate: (to: string) => void
}

export interface IPropsRegister {
    setEmail: (value: string) => void
    setPassword: (value: string) => void
    setRepeatPassword: (value: string) => void
    navigate: (to: string) => void
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

