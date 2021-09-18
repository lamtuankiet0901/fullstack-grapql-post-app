import { Button, Box, Flex, Spinner, Link } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import InputField from "../components/InputField"
import Wrapper from "../components/Wrapper"
import { ForgotPasswordInput, useForgotPasswordMutation } from "../generated/graphql"
import { useCheckAuth } from "../utils/useCheckAuth"
import NextLink from 'next/link'

const ForgotPassword = () => {
    const {data: authData, loading: authLoading } = useCheckAuth()

    const initialValues: ForgotPasswordInput = {email: ''}

    const [forgotPassword, {data, loading}] = useForgotPasswordMutation()

    const onForgotPasswordSubmit = async (values: ForgotPasswordInput) => {
        await forgotPassword({variables: {forgotPasswordInput: values}})
    }

    if (authLoading || (!authLoading && authData?.me)){
        return (
            <Flex justifyContent="center" alignItems="center" minH="100vh">
                <Spinner h={40} w={40}/>
            </Flex>
        )
    } else 
    return (
        <Wrapper size='small'>
            <Formik initialValues={initialValues} onSubmit={onForgotPasswordSubmit}>
                {
                    ({isSubmitting}) => 
                    !loading && data ? <Box>Please check your email</Box> :
                    (
                        <Form>
                            <InputField
                                name="email"
                                placeholder="Email"
                                lable="Email"
                                type="email"
                            />
                            <Flex alignItems="center" justifyContent="space-between" mt={4}>
                                <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
                                    Send Reset Password Email
                                </Button>
                                <NextLink href="/forgot-password">
                                    <Link ml="auto">Back to login</Link>
                                </NextLink>
                            </Flex>
                        </Form>
                    )
                }
            </Formik>
        </Wrapper>
    )
}

export default ForgotPassword
