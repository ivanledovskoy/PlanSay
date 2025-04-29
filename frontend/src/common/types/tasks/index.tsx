export interface IPropsTasks {
    onClose_props: any
    open_props: any
    selectedElement_props: any
}

export interface ISelectedElement {
    id: number,
    title: string,
    create_data: string,
    remember_data: string | null,
    is_completed: boolean,
    user_id: number,
    description: {value: string}
  }

