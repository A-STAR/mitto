import { Component, AfterViewChecked, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Item as Message } from './shared/item.interface';

import { DataService } from '../data.service';

import { ExportJSONDialogData, ExportJSONComponent } from './export-json/export-json.component';

type MessageData = Message;

const ACTION_COLUMN = 'actions';

@Component({
  selector: 'mit-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements AfterViewChecked {

  @ViewChild(MatSort) private sort: MatSort;

  get messages(): Message[] {
    return this.#messages;
  }

  get columns(): string[] {
    return this.#columns;
  }

  get ACTION_COLUMN(): string {
    return ACTION_COLUMN;
  }

  get dataSource(): MatTableDataSource<MessageData> {
    return this.#dataSource;
  }

  #messages: Message[];
  #columns: string[];
  #dataSource: MatTableDataSource<MessageData>;

  constructor(private dialog: MatDialog, private dataService: DataService) { }

  ngAfterViewChecked() {
    if (this.sort && !this.#dataSource?.sort) {
      this.#dataSource.sort = this.sort;
    }
  }

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

  onFilter(event: Event) {
    const query: string = (event.target as HTMLInputElement).value;

    this.#dataSource.filter = query
      .trim()
      .toLowerCase();
  }

  private setMessages(messages: Message[]) {
    this.#messages = messages;

    const keys: string[] = Object.keys(messages[0]);

    this.#columns = [...keys, ACTION_COLUMN];
    this.#messages = messages;

    this.setDataSource();
  }

  private setDataSource() {
    this.#dataSource = new MatTableDataSource(this.#messages);
  }

}
