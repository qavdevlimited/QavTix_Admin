import { ComponentType } from "react"
import { FilterKey } from "../resources/avaliable-filters"
import CategoryFilter from "./CategoryFilter"
import DateFilter from "./DateFilter"
import { StatusFilter } from "./StatusFilter"
import PriceFilter from "./PriceFilter"
import { PerformanceFilter } from "./PerformanceFilter"
import DateRangePresetFilter from "./DateRangePresetFilter"
import { PurchaseDateFilter } from "./PurchaseDateFilter"
import { EventFilter } from "./EventFilter"
import { SortByFilter } from "./SortByFilter"
import { UserFilter } from "./UsersFilter"
import { ListingTypeFilter } from "./ListingTypeFilter"
import { UserStatusFilter } from "./UserStatusFilter"
import { ActionsFilter } from "./ActionFilter"
import LocationFilter from "./LocationFilter"
import QuantityFilter from "./QuantityFilter"
import { TransactionStatusFilter } from "./TransactionFilter"

type FilterComponentProps<T> = {
  value: T
  onChange: (value: T) => void
  className?: string
  icon: string
  categories?: Category[]
  event?: string | null
  label?: string
  sortBy?: string
  statusOptions?: StatusOption[]
}

type FilterRegistryEntry<T> = {
  component: ComponentType<FilterComponentProps<T>>
  stateKey: keyof FilterValues
}

export const filterRegistry: Partial<Record<FilterKey, FilterRegistryEntry<any>>> = {
  categories: {
    component: CategoryFilter,
    stateKey: 'categories'
  },
  status: {
    component: StatusFilter,
    stateKey: 'status'
  },
  dateRange: {
    component: DateFilter,
    stateKey: 'dateRange'
  },
  transactionStatus: {
    component: TransactionStatusFilter,
    stateKey: 'transactionStatus'
  },
  dateRangePreset: {
    component: DateRangePresetFilter,
    stateKey: 'dateRangePreset'
  },
  priceRange: {
    component: PriceFilter,
    stateKey: 'priceRange'
  },
  performance: {
    component: PerformanceFilter,
    stateKey: 'performance'
  },
  sortBy: {
    component: SortByFilter,
    stateKey: "sortBy"
  },
  purchaseDate: {
    component: PurchaseDateFilter,
    stateKey: 'purchaseDate'
  },
  spendRange: {
    component: PriceFilter,
    stateKey: 'spendRange'
  },
  amountRange: {
    component: PriceFilter,
    stateKey: 'amountRange'
  },
  dateJoined: {
    component: DateFilter,
    stateKey: 'dateJoined'
  },
  lastActivity: {
    component: DateFilter,
    stateKey: 'lastActivity'
  },
  withdrawalDate: {
    component: DateFilter,
    stateKey: 'withdrawalDate'
  },
  event: {
    component: EventFilter,
    stateKey: 'event'
  },
  action: {
    component: ActionsFilter,
    stateKey: 'action'
  },
  location: {
    component: LocationFilter,
    stateKey: 'location'
  },
  quantityRange: {
    component: QuantityFilter,
    stateKey: 'quantityRange'
  },
  purchaseDateRange: {
    component: DateFilter,
    stateKey: 'purchaseDateRange'
  },
  user: {
    component: UserFilter,
    stateKey: 'user'
  },
  listingType: {
    component: ListingTypeFilter,
    stateKey: 'listingType'
  },
  userStatus: {
    component: UserStatusFilter,
    stateKey: 'userStatus'
  }
}