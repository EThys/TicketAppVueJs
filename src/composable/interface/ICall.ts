import type { ICounter } from "./ICounter"
import type { IUser } from "./IUser"

export interface ICall{
    Ticket          : number
    CounterFId      : number
    Note            : string
    UserFId         : number
    CreatedTime?    : string
    user?           : IUser
    counter?        : ICounter
}