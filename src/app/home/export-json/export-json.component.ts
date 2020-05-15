import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DataService } from '../../data.service';

export interface ExportJSONDialogData {
  json: string;
}

const COPY_BUTTON_TEXT = 'Copy All';

@Component({
  selector: 'mit-export-json',
  templateUrl: './export-json.component.html',
  styleUrls: ['./export-json.component.sass']
})
export class ExportJSONComponent {

  get json(): string {
    return this.data.json;
  }

  get copyButtonText(): string {
    return this.#copyButtonText;
  }

  get COPY_BUTTON_TEXT(): string {
    return COPY_BUTTON_TEXT;
  }

  #copyButtonText = COPY_BUTTON_TEXT;

  constructor(@Inject(MAT_DIALOG_DATA) private data: ExportJSONDialogData, private dataService: DataService) { }

  onCopy() {
    const json: string = this.data.json;

    this.dataService.copyText(json);

    this.#copyButtonText = 'Copied';

    setTimeout(() => this.#copyButtonText = COPY_BUTTON_TEXT, 1000);
  }

  onDownloadJSON() {
    const json: string = this.data.json;
    const filename = 'result.json';
    const type = 'application/json';

    this.dataService.downloadFile(json, filename, type);
  }

}
