import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from "@chakra-ui/react"
import { useField } from "formik"

interface InputFieldProps {
    name: string
    lable: string
    placeholder: string
    type: string
    textarea?: boolean
}

const InputField = ({textarea, ...props}: InputFieldProps) => {
    const [field, {error}] = useField(props)
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{props.lable}</FormLabel>
            {textarea ? <Textarea {...field} id={field.name} {...props}/> :
            <Input 
                {...field}
                id={field.name}
                {...props}
            />
            }
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    )
}

export default InputField
