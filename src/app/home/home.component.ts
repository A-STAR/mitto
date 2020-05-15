import { Component } from '@angular/core';

import { Item as Message } from './shared/item.interface';

import { DataService } from '../data.service';

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

  constructor(private dataService: DataService) { }

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

  private setMessages(items: Message[]) {
    this.#messages = items;
  }

}
