import { LightningElement, api, wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ACCOUNT_REGISTRATION_NO_OF_COMPANY from '@salesforce/schema/Account.Registration_No_of_Company__c';
import ACCOUNT_BANK_NAME from '@salesforce/schema/Account.Bank_Name__c';
import ACCOUNT_BILLING_COUNTRY_CODE from '@salesforce/schema/Account.BillingCountryCode';
import ACCOUNT_NUMBER from '@salesforce/schema/Account.AccountNumber';
import ACCOUNT_SWIFT_CODE from '@salesforce/schema/Account.Swift_Code__c';
import ACCOUNT_IBAN from '@salesforce/schema/Account.iban__c';
import ACCOUNT_CURRENCY_ISO_CODE from '@salesforce/schema/Account.CurrencyIsoCode';
import { getRecord} from 'lightning/uiRecordApi';

const fieldList = [ACCOUNT_REGISTRATION_NO_OF_COMPANY, ACCOUNT_BANK_NAME, ACCOUNT_BILLING_COUNTRY_CODE, 
                   ACCOUNT_NUMBER, ACCOUNT_SWIFT_CODE,ACCOUNT_IBAN, ACCOUNT_CURRENCY_ISO_CODE];

export default class AccountFinance extends LightningElement {
    @api recordId;// = '001WU00000BlWawYAF';
    isSaved = false;
    isEdit = true;
    isOpen = false;
    saveDisabled;

    accRegistration = ACCOUNT_REGISTRATION_NO_OF_COMPANY;
    accountBank = ACCOUNT_BANK_NAME;
    accountBillingCountryCode = ACCOUNT_BILLING_COUNTRY_CODE;
    accountNumber = ACCOUNT_NUMBER;
    accountSwiftCode = ACCOUNT_SWIFT_CODE;
    accountIban = ACCOUNT_IBAN;
    accountCurrencyIsoCode = ACCOUNT_CURRENCY_ISO_CODE;

    editTitle = "Please complete your details here";
    viewTitle = "Details Completed";
    titleAction = this.editTitle;
    customClass = 'editStyle';
    account;

    @wire(getRecord, { recordId: "$recordId", fields: fieldList})    
    account;

    handleSubmit(event){
        event.preventDefault();
        const fields = event.detail.fields;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }
    handleSuccess(event){
        this.dispatchEvent(
            new ShowToastEvent({
                title: "Account Finance",
                message: "Information saved",
                variant: "Success"
            })
        )
        this.template.querySelector('c-file-upload').uploadFiles();

        this.isEdit = false;
        this.isOpen = false;
        this.customClass = 'viewStyle';
        this.titleAction = this.viewTitle;
    }

    get isEditOpen(){
        return this.isOpen && this.isEdit;
    }

    get isViewOpen(){
        return this.isOpen && !this.isEdit;
    }

    handleError(event){
        let message = event.detail.detail;
        this.dispatchEvent(
            new ShowToastEvent({
                title: "Account Finance",
                message: message,
                variant: "Error"
            })
        )
    }

    toggleEditForm(){
        this.isOpen = !this.isOpen;
        this.changeDisabled();
     }

    changeToEdit(){
        this.isEdit = true;
        this.isOpen = true;
    }

    isInputValid() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('[data-id="isValidate"]');
        console.log('isInputValid=',inputFields.length);
        inputFields.forEach(inputField => {
            if (!inputField.value) {
                isValid = false;
                isValid = inputField.reportValidity();
            }
        });
        return isValid;
    }

    changeDisabled(){
        this.saveDisabled = !this.isInputValid();
    }
}