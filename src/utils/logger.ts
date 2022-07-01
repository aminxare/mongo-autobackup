///TODO create higher order function

import {Schema, model} from 'mongoose'

const loggerSchema = new Schema({
    name: String,
    text: {
        type: String,
    }
})

export default model("logger", loggerSchema)