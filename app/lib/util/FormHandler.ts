import { Validator } from "../definitions"

/**
  * Checks if every key is in the form
  * @param keys 
  * @returns 
  */
function hasEveryKey(formData: FormData, keys: readonly string[]) {
    return keys.every(key => formData.has(key))
}

/**
  * Tests the data of the form if every value satisfies the given regex
  * This function assumes that the form has every keys defined in the formValidator
  * 
  * @param formValidator 
  * @param formData 
  * @returns 
  */
function testValues(formData: FormData, formValidator: Validator) {
    const formError: { [key: string]: string } = {}

    Object.entries(formValidator)
        .forEach(([key, value]) => {
            const isValid = value.validator.test(formData.get(key) as string)
            if (!isValid) {
                formError[key] = value.errorMessage
            }
        })

    return {
        error: formError,
        isError: Object.keys(formError).length !== 0
    }
}

/**
  * This function extracts the data from the given form using the formValidator parameter's keys
  * This function assumes that you have already checked if these keys are in the form data
  * 
  * @param formValidator 
  * @param formData 
  * @returns 
  */
function extractValues(formData: FormData, formValidator: Validator) {
    return Object.keys(formValidator)
        .map(key => formData.get(key) as string)
}

export function FormHandler(formData: FormData) {
    return {
        validator: {
            /**
             * Checks if every key is in the form
             * @param keys 
             * @returns 
             */
            hasEveryKey: (keys: readonly string[]) => hasEveryKey(formData, keys),

            /**
             * Tests the data of the form if every value satisfies the given regex
             * This function assumes that the form has every keys defined in the formValidator
             * 
             * @param formValidator 
             * @returns 
             */
            testValues: (formValidator: Validator) => testValues(formData, formValidator)
        },

        /**
         * This function extracts the data from the given form using the formValidator parameter's keys
         * This function assumes that you have already checked if these keys are in the form data
         * 
         * @param formValidator 
         * @returns 
         */
        extractValues: (formValidator: Validator) => extractValues(formData, formValidator)
    }
}