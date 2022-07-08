import { Schema, model } from 'mongoose';

const loggerSchema = new Schema({
    name: {
        type: String,
        default: "log",
    },
    text: {
        type: String,
        require: true,
    },
    date:{
        type: String,
    }
})

loggerSchema.pre("save",function(next){
    this.date = new Date().toISOString();
    next();
})

function createLogger(logCollectionName: string){
    return model(logCollectionName, loggerSchema)
}

export default createLogger;