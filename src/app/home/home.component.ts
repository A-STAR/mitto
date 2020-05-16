import { Component, AfterViewChecked, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Item as Message } from './shared/item.interface';
import { MessageData } from './shared/message-data.type';

import { DataService } from '../data.service';

import { ExportJSONDialogData, ExportJSONComponent } from './export-json/export-json.component';

import { phoneNumberValidator } from './shared/phone-number.validator';

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

  get editMessageForm(): FormGroup {
    return this.#editMessageForm;
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
  #editMessageForm: FormGroup;
  #columns: string[];
  #dataSource: MatTableDataSource<MessageData>;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private dataService: DataService) { }

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

    this.initForms(keys);
    this.setDataSource();
  }

  private initForms(keys: string[]) {
    this.#editMessageForm = this.fb.group({});

    keys
      .filter((key: string): boolean => key !== 'messageUUID')
      .forEach((key: string) => {
        const validators: ValidatorFn[] = [Validators.required];

        if (key === 'sender') {
          validators.push(phoneNumberValidator);
        }

        const control: FormControl = this.fb.control(undefined, validators);

        this.#editMessageForm.addControl(key, control);
      });
  }

  private setDataSource() {
    this.#dataSource = new MatTableDataSource(this.#messages);
  }

}
