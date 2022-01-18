import { Injectable } from '@angular/core';

import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root',
})
export class DownloadFileService {
  private _toast!: HotToastService;
  public downloadFile(blob: Blob, fileName: string, isOpenAfterDownload?: boolean) {
    const filename = fileName ?? `unknown`;
    const dataType = blob.type;
    const binaryData = [];
    binaryData.push(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
    if (filename) downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    if (isOpenAfterDownload) {
      const newWin = window.open(downloadLink.href);
      try {
        newWin?.focus();
      } catch (e) {
        this._toast.warning('Pop-up Blocker is enabled! Please add this site to your exception list.');
      }
      downloadLink.click();
    } else downloadLink.click();
  }
}
