import { Component } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

import { Item as Message } from './shared/item.interface';

import { DataService } from '../data.service';

import { ExportJSONDialogData, ExportJSONComponent } from './export-json/export-json.component';

@Component({
  selector: 'mit-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {

  get messages(): Message[] {
    return this.#messages;
  }

  #messages: Message[];

  constructor(private dialog: MatDialog, private dataService: DataService) { }

  onUploadCSV(event: Event) {
    this.dataService
      .uploadFile(event)
      .then((csvData: string) => {
        const messages: Message[] = this.dataService.parseCSV(csvData);

        this.setMessages(messages);
      })
      .catch();
  }

  onDownloadCSV() {
    const csvData: string = this.dataService.compileCSV(this.#messages);
    const filename = 'result.csv';
    const type = 'text/csv';

    this.dataService.downloadFile(csvData, filename, type);
  }

  onExportJSON() {
    const json: string = JSON.stringify(this.#messages, undefined, 2);

    const config: MatDialogConfig<ExportJSONDialogData> = {
      width: '800px',
      data: { json }
    };

    this.dialog.open(ExportJSONComponent, config);
  }

  private setMessages(items: Message[]) {
    this.#messages = items;
  }

}
