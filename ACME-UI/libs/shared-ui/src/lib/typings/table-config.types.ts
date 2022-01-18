/* eslint-disable @typescript-eslint/no-explicit-any */
import { Type } from '@angular/core';

import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { LazyLoadEvent } from 'primeng/api';

import { IDynamicComponent } from './dynamic-template';

export enum ActionType {
  Link = 'link',
  OutputEvent = 'outputEvent',
  MoreActionsMenu = 'MoreActionsMenu',
}

export interface IRowAction {
  actionType?: ActionType;
  buttonColorClass?: string;
  displayText?: string;
  fontAwesomeIcon?: IconProp;
  link?: string;
  materialIcon?: string;
  name: string;
  primeNgIcon?: string;
  tooltipTitle?: string;
  subActionsTemplateComponentRef?: Type<IDynamicComponent>;
  visibilityHandlerCallback?: (rowData: any, args?: any[]) => boolean;
}

export interface ITableRowCustomActionEvent {
  actionName: string;
  row: unknown;
}

export interface ITableColumConfig {
  displayName: string;
  filterable?: boolean;
  isCustomActionColumn?: boolean;
  isCustomTemplate?: boolean;
  isSortable?: boolean;
  name?: string;
  pathToProperty: string;
  propertyName: string;
  rowActions?: IRowAction[];

  // This should contain component class which will be rendered dynamically
  templateComponentRef?: Type<IDynamicComponent>;
}

export enum TableSortOrder {
  dsc = -1,
  asc = 1,
}

export interface IGlobalLibTableFilters extends LazyLoadEvent {
  //event.first = First row offset
  //event.rows = Number of rows per page
  //event.sortField = Field name to sort with
  //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
  //filters: FilterMetadata object having field as key and filter value, filter matchMode as value
  pageNumber: number;
  columnFilters?: {
    [s: string]: unknown[] | unknown;
  };
  rowsPerPage?: number;
  entityId?: string;
}

export class GlobalLibTableConfig {
  public data: Array<unknown>;
  public filters: IGlobalLibTableFilters;
  public headerConfig: ITableColumConfig[];
  public heading: string;
  public idColumn: string;
  isLoading?: boolean;
  public pagination: boolean;
  rowsPerPageOptions?: number[];
  showCurrentPageReport?: boolean;
  totalRecords?: number;
  expandibleRows?: boolean;
  expandibleRowTemplateRef?: Type<IDynamicComponent>;

  /**
   *
   */
  // eslint-disable-next-line max-lines-per-function
  constructor(
    _data: Array<Record<string, unknown>>,
    _filters: IGlobalLibTableFilters,
    _headerConfig: ITableColumConfig[],
    _heading: string,
    _idColumn: string,
    _isLoading: boolean,
    _pagination: boolean,
    _rowActions: IRowAction[],
    _rowsPerPageOptions: number[],
    _showCurrentPageReport: boolean,
    _totalRecords: number
  ) {
    this.data = _data;
    this.filters = _filters;
    this.headerConfig = _headerConfig;
    this.heading = _heading;
    this.idColumn = _idColumn;
    this.isLoading = _isLoading;
    this.pagination = _pagination;
    this.rowsPerPageOptions = _rowsPerPageOptions;
    this.showCurrentPageReport = _showCurrentPageReport;
    this.totalRecords = _totalRecords;
  }
}

export const defaultGlobalLibTableConfig: GlobalLibTableConfig = {
  data: [],
  filters: {
    pageNumber: 1,
    rowsPerPage: 10,
    sortField: '',
    sortOrder: TableSortOrder.dsc,
    entityId: '',
  },
  headerConfig: [
    {
      name: 'id',
      pathToProperty: 'id',
      propertyName: 'id',
      displayName: 'Id',
      isSortable: true,
      isCustomTemplate: false,
    },
  ],
  heading: '',
  idColumn: 'id',
  isLoading: false,
  pagination: true,

  rowsPerPageOptions: [10, 20, 30],
  showCurrentPageReport: false,
  totalRecords: 0,
};
