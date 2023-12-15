interface IUser {
    id: number
    name: string
    phone: string
    password: string
    avatar?: string
    status: boolean
    permissions: string[]
    UserRole: IUserRole[]
    created_at?: string
    updated_at?: string
}

interface IUserRole {
    id: number
    userId: number
    roleId: number
    created_at: string
    updated_at: string
    role: IRole
}

interface IRole {
    id: number
    name: string
    creator: string
    remark: string
    created_at: string
    updated_at: string
    RolePermission: IRolePermission[]
}

interface IRolePermission {
    id: number
    roleId: number
    permissionId: number
    created_at: string
    updated_at: string
    permission: IPermission
}

interface IPermission {
    id: number
    name: string
    creator: string
    remark: string
    created_at: string
    updated_at: string
}

