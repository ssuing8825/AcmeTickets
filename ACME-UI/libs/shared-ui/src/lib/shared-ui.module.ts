import { NgModule } from '@angular/core';

import { ComponentsModule } from './components/components.module';
import { DownloadFileService, LocalCacheService } from '.';

@NgModule({
  imports: [ComponentsModule],
  exports: [ComponentsModule],
  providers: [LocalCacheService, DownloadFileService],
})
export class SharedUiModule {}
