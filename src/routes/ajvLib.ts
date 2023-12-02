import Ajv from 'ajv';
import def from 'ajv/dist/vocabularies/discriminator';

const ajv = new Ajv({
    removeAdditional: true
});

ajv.addSchema({
    $id: 'urn:schema:request:user',
    type: "object",
    required: ["email"],
    properties: {
        name: {type: "string"},
        loggedInUsing: {type: "string", enum: ["twitter", "facebook"]},
        ip: {type: "string", maxLength: 15, minLength: 7},
        email: {type: "string"}
    }
});
ajv.addSchema({
    $id: "urn:schema:request:UserAccessToken",
    type: "object",
    required: ["X-access-token"],
    properties: {
        UserToken: {type: "string"}
    }
})


export default ajv;