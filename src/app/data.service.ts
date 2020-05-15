import { Injectable } from '@angular/core';

import { Item } from './home/shared/item.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  parseCSV(csvData: string): Item[] {
    const data: Item[] = [];

    const lines: string[] = csvData
      .trim()
      .split('\n');

    const keys: string[] = lines[0]
      .split(',')
      .map((key: string, index: number): string => {
        key = key.trim();

        return key ? key : index.toString();
      });

    lines
      .slice(1)
      .forEach((line: string) => {
        const item: Item = {};

        const values: string[] = line
          .split(',')
          .map((value: string): string => value.trim());

        values.forEach((value: string, index: number) => {
          const key: string = keys[index];

          item[key] = value;
        });

        data.push(item);
      });

    return data;
  }

  uploadFile(event: Event): Promise<string | ArrayBuffer> {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const fileList: FileList = target.files;

    if (!fileList.length) {
      return Promise.reject();
    }

    const file: File = fileList.item(0);

    const fileReader = new FileReader();

    return new Promise<string | ArrayBuffer>((resolve) => {
      fileReader.addEventListener('load', (progressEvent: ProgressEvent) => {
        fileReader.removeEventListener('load', undefined, false);

        target.value = '';

        const data: string | ArrayBuffer = (progressEvent.target as FileReader).result;

        resolve(data);
      }, false);

      fileReader.readAsText(file);
    });
  }

  compileCSV(data: Item[]): string {
    const keys: string = Object
      .keys(data[0])
      .join(',');

    const values: string[] = data.map((item: Item) => {
      return Object
        .values(item)
        .join(',');
    });

    const csvData: string = [keys, ...values].join('\n');

    return csvData;
  }

  downloadFile(part: BlobPart, filename: string, type: string = 'text/plain') {
    const blob: Blob = new Blob([part], { type });

    const anchorEl: HTMLAnchorElement = document.createElement('a');
    const objectURL: string = URL.createObjectURL(blob);

    anchorEl.href = objectURL;
    anchorEl.download = filename;
    anchorEl.target = '_blank';

    anchorEl.click();

    URL.revokeObjectURL(objectURL);
  }

}
