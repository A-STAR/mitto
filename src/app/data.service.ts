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

  copyText(text: string) {
    const textAreaEl: HTMLTextAreaElement = document.createElement('textarea');

    textAreaEl.textContent = text;

    document.body.append(textAreaEl);

    textAreaEl.select();
    textAreaEl.setSelectionRange(0, 99999);

    document.execCommand('copy');

    document.body.removeChild(textAreaEl);
  }

  getUUID(
    usedUUIDs: string[],
    chars: string = '0123456789abcdefghiklmnopqrstuvwxyz',
    segmentLengths: number[] = [8, 4, 4, 4, 12],
    delimiter = '-'
  ): string {
    const getRandomIDSegment = (length?: number): string => {
      const charList: string[] = chars.split('');

      if (!length) {
        length = Math.floor(Math.random() * charList.length);
      }

      let randomString = '';

      for (let i = 0; i < length; i++) {
        randomString += charList[Math.floor(Math.random() * charList.length)];
      }

      return randomString;
    };

    const getRandomID = (): string => segmentLengths.reduce((
      randomID: string,
      segment: number
    ): string => {
      return `${randomID}${randomID.length ? delimiter : ''}${getRandomIDSegment(segment)}`;
    }, '');

    const getUUID = (): string => {
      const id: string = getRandomID();

      const isIDUsed: boolean = usedUUIDs.includes(id);

      return isIDUsed ? getUUID() : id;
    };

    return getUUID();
  }

}
