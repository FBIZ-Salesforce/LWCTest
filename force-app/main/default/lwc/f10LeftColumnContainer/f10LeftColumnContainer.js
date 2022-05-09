import { LightningElement, api, wire, track } from 'lwc';
// import { publish, subscribe, MessageContext } from 'lightning/messageService';
// import RECORD_SELECTED_CHANNEL from '@salesforce/messageChannel/Record_Selected__c';
// import getStatsApex from '@salesforce/apex/f10Class1.getStatsApex';

export default class F10LeftColumnContainer extends LightningElement {
    @api recordId;
    @api portal = false;    
    
    @track varFiles = false;
    @track varChecks = true;
    @track varMessages = false;
    @track varDocusign = false;
    @track varCip = false;
    @track varUser = false;
    modalSelected = 'files';

    files(){
        this.varFiles = true;
        this.varChecks = this.varMessages = this.varDocusign = this.varCip = this.varUser = false;
        this.publishMessage('na', 'files', 'f10LeftColumn_ModuleChange');
    }
    checks(){
        this.varChecks = true;
        this.varFiles = this.varMessages = this.varDocusign = this.varCip = this.varUser = false;
        this.publishMessage('na', 'checks', 'f10LeftColumn_ModuleChange');
    }
    messages(){
        this.varMessages = true;
        this.varFiles = this.varChecks = this.varDocusign = this.varCip = this.varUser = false;
        this.publishMessage('na', 'messages', 'f10LeftColumn_ModuleChange');
    }
    user(){
        this.varUser = true;
        this.varFiles = this.varChecks = this.varDocusign = this.varCip = this.varMessages = false;
        this.publishMessage('na', 'users', 'f10LeftColumn_ModuleChange');
    }
    docusign(){
        this.varDocusign = true;
        this.varFiles = this.varChecks = this.varMessages = this.varCip = this.varUser = false;
        this.publishMessage('na', 'docusign', 'f10LeftColumn_ModuleChange');
    }
    cip(){
        this.varCip = true;
        this.varFiles = this.varChecks = this.varMessages = this.varDocusign = this.varUser = false;
        this.publishMessage('na', 'cip', 'f10LeftColumn_ModuleChange');
    }

    publishMessage(recInfo, detailInfo, typeInfo){
        const payload = {recordId: recInfo, detail: detailInfo, type: typeInfo};
        publish(this.messageContext, RECORD_SELECTED_CHANNEL, payload);
    }

    //Dynamic CSS of the buttons
    get fileClass(){
        return this.varFiles ? 'active' : 'inactive';
    }
    get checkClass(){
        return this.varChecks ? 'active' : 'inactive';
    }
    get messClass(){
        return this.varMessages ? 'active' : 'inactive';
    }
    get docusignClass(){
        return this.varDocusign ? 'active' : 'inactive';
    }
    get cipClass(){
        return this.varCip ? 'active' : 'inactive';
    }
    get userClass(){
        return this.varUser ? 'active' : 'inactive';
    }

    //LMS Setup
    // @wire(MessageContext)
    // messageContext;

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            RECORD_SELECTED_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    handleMessage(e) {
        if(e.type == 'f10LeftColumnContainerUpdate'){
            this.handleLoad();
        } else if(e.type == 'f10LeftColumnSwitchUploaded'){
            this.files();
        }
    }

    requestedCount = 0;
    uploadedCount = 0;
    messageCount = 0;
    count1 = false;
    count2 = false;
    count3 = false;

    async handleLoad(){
        let newParams = await getStatsApex({recId : this.recordId, portal: this.portal});
        newParams = JSON.parse(newParams);
        this.requestedCount = newParams.requestedCount;
        this.uploadedCount = newParams.uploadedCount;
        this.messageCount = newParams.messageCount;

        if(this.requestedCount > 0){
            this.count1 = true;
        }
        if(this.uploadedCount > 0){
            this.count2 = true;
        }
        if(this.messageCount > 0){
            this.count3 = true;
        }
    }

    // connectedCallback(){
    //     this.handleLoad();
    //     this.subscribeToMessageChannel();
    // }
}