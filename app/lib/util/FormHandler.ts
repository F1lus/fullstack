import {Validator} from "../definitions"
import {AppError} from "@/app/lib/api/error/AppError";
import {FormError} from "@/app/lib/api/error/FormError";

/**
 * Checks if every key is in the form
 * @param formData
 * @param keys
 * @returns
 */
function hasEveryKey(formData: FormData, keys: readonly string[]) {
    return keys.every(key => formData.has(key))
}

/**
 * Tests the data of the form if every value satisfies the given regex
 * This function assumes that the form has every key defined in the formValidator
 *
 * @param formValidator
 * @param formData
 * @returns
 */
function testValues(formData: FormData, formValidator: Validator) {
    const filteredEntries = Object.entries(formValidator)
        .filter(
            ([k, v]) => !v.validator.test(formData.get(k) as string)
        )
        .map(([k, v]) => [k, v.errorMessage])


    if (filteredEntries.length !== 0) {
        throw new FormError(Object.fromEntries(filteredEntries), 400)
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
             * This function assumes that the form has every key defined in the formValidator
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

export async function parseForm(request: Request) {
    try {
        return request.formData()
    } catch {
        throw new AppError("The incoming Content-Type must be a form!")
    }
}