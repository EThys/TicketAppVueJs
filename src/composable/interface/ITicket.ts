import type { ICurrency } from './ICurrency'
import type { ITransferStatus } from './ITransferStatus'
import type { ITransferType } from './ITransferType'
import type { IUser } from './IUser'

export interface ITicket {
  TicketId?: number
  Amount: number
  Phone?: string
  Name?: string
  Note?: string
  Motif?: string
  CurrencyFId: number
  UserFId: number
  TransfertTypeFId: number
  TransfertStatusFId: number
  Debut?: string
  FinS?: string
  DureeS?: string
  FinP?: string
  DureeP?: string
  ClotureDateCreated?: string
  DateCreated?: string
  user?: IUser
  currency?: ICurrency
  transfer_type?: ITransferType
  transferStatus?: ITransferStatus
}
export interface ITicketRequestClose {
  TicketId: number
  Motif: string
  TransferStatusFId: number
  ClotureDateCreated: string
}

export interface ITicketFilter {
  TransferTypeFId: number
  TransferStatusFId: number
  dateTo: string
  dateFrom: string
}
