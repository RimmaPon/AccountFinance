import { LightningElement, api, wire } from 'lwc';
import getRelatedFiles from '@salesforce/apex/FileDownloadController.getRelatedFiles';

export default class fileDownload extends LightningElement {  
    @api recordId;  
    filesList =[];

    @wire(getRelatedFiles, {recordId: '$recordId'})
    wiredResult({data, error}){ 
        if(data){ 
            this.filesList = Object.keys(data).map(item=>({"label":data[item],
             "value": item,
             "url":`/sfc/servlet.shepherd/document/download/${item}`
            }))
        }
        if(error){ 
            console.log(error)
        }
    }
}