

class GEOPT{

    generateEmailOpt(from , to , subject, template, context, attachments){

        return { 
    
            from : from,
            to : to,
            subject : subject,
            template : template,
            context : context,
            attachments : attachments
        }
    }

}

module.exports  = GEOPT