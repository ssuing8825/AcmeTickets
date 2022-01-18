import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ErrorTailorModule } from '@ngneat/error-tailor';
import { SubscribeModule } from '@ngneat/subscribe';

import { SharedUiModule } from '@globalLib/shared-ui';

import { errorTailerConfig } from './constants/form.validators.constants';
import {
  AclValidation,
  PhoneMaskPipe,
  ReactiveFormValueToMdTableFilterPipe,
  SideNavMenuByRolePipe,
  SortByPropertyNamePipe,
  ZipCodeMaskPipe,
} from './pipes';

const ErrorTailor = ErrorTailorModule.forRoot(errorTailerConfig);

const ANGULAR_MODULES = [CommonModule, FormsModule];

const THIRD_PARTY_MODULES = [SubscribeModule];
const SHARED_COMPONENTS = [];
const SHARED_PIPES = [
  ReactiveFormValueToMdTableFilterPipe,
  AclValidation,
  SideNavMenuByRolePipe,
  SortByPropertyNamePipe,
  PhoneMaskPipe,
  ZipCodeMaskPipe,
];
@NgModule({
  imports: [...ANGULAR_MODULES, ...THIRD_PARTY_MODULES, ErrorTailor, SharedUiModule],
  declarations: [...SHARED_PIPES],
  exports: [...THIRD_PARTY_MODULES, ...SHARED_PIPES],
})
export class SharedModule {}
