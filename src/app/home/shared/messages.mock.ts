import { Item as Message } from './item.interface';

export const MESSAGES_MOCK: Message[] = [
  {
    poolNumber: '1',
    sender: 'Damir',
    notRoutedReason: 'NumberDoesntExist',
    sentDateTime: '2019-08-13T0:0:48.1535075Z',
    requestedDeliveryReportMaskText: 'Submitted',
    deliveryReportReceivedDateTime: '2019-08-13T0:0:48.1535075Z',
    isUnicode: 'TRUE',
    messageUUID: '4889e632-a314-45e2-89fd-35b07b4f9ff2'
  },
  {
    poolNumber: '0',
    sender: '+381600171972',
    notRoutedReason: '',
    sentDateTime: '2019-08-13T08:01:43.7313793Z',
    requestedDeliveryReportMaskText: 'Submitted',
    deliveryReportReceivedDateTime: '2019-08-13T08:01:43.7313793Z',
    isUnicode: 'FALSE',
    messageUUID: 'ea4bad80-dc03-4e2e-8235-9b8eddd905e1'
  },
  {
    poolNumber: '0',
    sender: '381600171972',
    notRoutedReason: '',
    sentDateTime: '2019-08-13T0:0:26.7660668Z',
    requestedDeliveryReportMaskText: 'InProgress',
    deliveryReportReceivedDateTime: '2019-08-13T0:0:26.7660668Z',
    isUnicode: 'FALSE',
    messageUUID: 'f90bdb6b-8ff8-47e8-8664-02b814003965'
  }
];
