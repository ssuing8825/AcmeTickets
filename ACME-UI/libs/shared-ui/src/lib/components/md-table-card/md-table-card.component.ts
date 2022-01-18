import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { SortDirection } from '@swimlane/ngx-datatable';

import { Observable } from 'rxjs';

import {
  ActionType,
  GlobalLibTableConfig,
  IGlobalLibTableFilters,
  ITableColumConfig,
  ITableRowCustomActionEvent,
} from '../../typings/table-config.types';

@Component({
  selector: 'global-lib-md-table-card',
  templateUrl: './md-table-card.component.html',
  styleUrls: ['./md-table-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MdTableCardComponent {
  public ActionType: typeof ActionType = ActionType;
  @Output() public filtersChanged = new EventEmitter<GlobalLibTableConfig>();
  @Output() public rowCustomActionEvent = new EventEmitter<ITableRowCustomActionEvent>();
  @Input() tableConfig$!: Observable<GlobalLibTableConfig>;
  @Input() isLoading = false;
  public expandedElement: unknown | null;

  public onCustomActionClick(row: Record<string, unknown>, actionName: string) {
    this.rowCustomActionEvent.emit({ row, actionName });
  }

  public onTableEvent(tableConfig: GlobalLibTableConfig, newFilters: IGlobalLibTableFilters) {
    tableConfig = { ...tableConfig, filters: newFilters };
    this.filtersChanged.emit(tableConfig);
  }

  public onPageChange(event: PageEvent, tableConfig: GlobalLibTableConfig) {
    const pageNumber = event.pageIndex + 1;
    const rowsPerPage = event.pageSize;
    const newFilters: IGlobalLibTableFilters = { ...tableConfig.filters, pageNumber, rowsPerPage };
    this.onTableEvent(tableConfig, newFilters);
  }

  public onSortChange(sort: Sort, tableConfig: GlobalLibTableConfig) {
    const sortField = sort.active;
    const sortOrder = sort.direction === SortDirection.asc || sort.direction === '' ? 1 : -1;

    const newFilters: IGlobalLibTableFilters = { ...tableConfig.filters, sortField, sortOrder };
    this.onTableEvent(tableConfig, newFilters);
  }

  public trackByColumnName(index: number, headerConfig: ITableColumConfig): string {
    return headerConfig.pathToProperty;
  }
}
