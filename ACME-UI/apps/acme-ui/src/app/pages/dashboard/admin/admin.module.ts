import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedUiModule } from '@acme/shared-ui';

import { AdminComponent } from './admin.component';
import { AdminService } from './admin.service';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [AdminComponent],
  imports: [CommonModule, AdminRoutingModule, SharedUiModule],
  providers: [AdminService],
})
export class AdminModule {}
