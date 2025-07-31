export const apiUrls={
    sendEmail:{
         endpoint:'send',
         method:'POST'
    },

    saveSentEmails:{
        endpoint:'save',
        method:'POST'
    },
    getEmailFromType:{
        endpoint:'emails',
        method:'GET'
    },
    saveDraftEmails:{
        endpoint:'save-draft',
        method:'POST'
    },
    deleteEmails:{
        endpoint:'delete',
        method:'DELETE'
    },
    moveEmailsToBin:{
        endpoint:'bin',
        method:'POST'
    },
    toggleStarredEmails:{
        endpoint:'starred',
        method:'POST'
    }

}