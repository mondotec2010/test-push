export class UploadResult {
    timestamp: Date;
    status: string;
    errorCode: string;
    fileRef: string; // Il reference che serve al backend per ritrovare il file
    //fileName: string;
    fileType: string;
    size: number;
    message: string;
}



