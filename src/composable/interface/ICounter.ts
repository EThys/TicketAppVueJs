import type { IBranch } from './IBranch'

export interface ICounter {
  counterId?: number
  counterName: string
  branchFId: number
  branch?: IBranch
}
