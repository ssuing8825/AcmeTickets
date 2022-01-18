import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';

import { ActionType, GlobalLibTableConfig, IGlobalLibTableFilters, ITableColumConfig, ITableRowCustomActionEvent } from '../../typings';

@Component({
  selector: 'global-lib-prime-ng-table',
  templateUrl: './prime-ng-table.component.html',
  styleUrls: ['./prime-ng-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimeNgTableComponent {
  public ActionType: typeof ActionType = ActionType;
  @Output() public filtersChanged = new EventEmitter<GlobalLibTableConfig>();
  @Output() public rowCustomActionEvent = new EventEmitter<ITableRowCustomActionEvent>();
  @Input() tableConfig$: Observable<GlobalLibTableConfig> | undefined;

  public getPageNumber(event: LazyLoadEvent) {
    // event.first = First row offset
    // event.rows = Number of rows per page
    // event.sortField = Field name to sort with
    // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    // filters: FilterMetadata object having field as key and filter value, filter matchMode as value
    if (event && event.first && event.rows) {
      return Math.ceil(event.first / event.rows);
    }
    return 1;
  }

  public onCustomActionClick(row: Record<string, unknown>, actionName: string) {
    this.rowCustomActionEvent.emit({ row, actionName });
  }

  public onFiltersChanged(event: LazyLoadEvent, tableConfig: GlobalLibTableConfig) {
    const pageNumber = this.getPageNumber(event);
    const newFilters: IGlobalLibTableFilters = { ...event, pageNumber };
    tableConfig = { ...tableConfig, filters: newFilters };
    this.filtersChanged.emit(tableConfig);
  }

  public trackByColumnName(index: number, headerConfig: ITableColumConfig): string {
    return headerConfig.pathToProperty;
  }
}
