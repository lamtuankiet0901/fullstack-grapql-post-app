import { Button, Flex, Box, Link, Spinner, Alert, AlertIcon, AlertTitle, useToast } from "@chakra-ui/react"
import { Form, Formik, FormikHelpers } from "formik"
import { useRouter } from "next/router"
import { useState } from "react"
import InputField from "../components/InputField"
import Wrapper from "../components/Wrapper"
import { ChangePasswordInput, MeDocument, MeQuery, useChangePasswordMutation } from "../generated/graphql"
import { mapFieldErrors } from "../helpers/mapFieldErrors"
import NextLink from 'next/link'
import { useCheckAuth } from "../utils/useCheckAuth"

const ChangePassword = () => {
    const router = useRouter()
    const toast = useToast()
    const {query} = router

    const {data: authData, loading: authLoading } = useCheckAuth()

    const initialValues: ChangePasswordInput = {
        newPassword: ''
    }

    const [tokenError, setTokenError] = useState('')

    const [changePasswrod, _] = useChangePasswordMutation()

    const onChangePasswordSubmit = async (values: ChangePasswordInput, {setErrors}: FormikHelpers<ChangePasswordInput>) => {
        if(query.userId && query.token){
            const response = await changePasswrod({
                variables: {
                    userId: query.userId as string,
                    token: query.token as string,
                    changePasswordInput: values
                },
                update(cache, {data}) {
                    // console.log('DATA LOGIN', data)
                    // const meData = cache.readQuery({query: MeDocument})
                    // console.log('MEDATA', meData)
                    
                    if(data?.changePassword.success){
                        cache.writeQuery<MeQuery>({
                            query: MeDocument,
                            data: {me: data.changePassword.user}
                        })
                    }
                }
            })

            if(response.data?.changePassword.errors){
                const fieldErrors = mapFieldErrors(response.data?.changePassword.errors)
                if('token' in fieldErrors){
                    setTokenError(fieldErrors.token)
                }
                setErrors(fieldErrors)
            } else if (response.data?.changePassword.user){
                toast({
                    title: "Welcome",
                    description: `${response.data.changePassword.user.username}`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                })
                router.push('/')
            }
        }
    }
    if (authLoading || (!authLoading && authData?.me)){
        return (
            <Flex justifyContent="center" alignItems="center" minH="100vh">
                <Spinner h={40} w={40}/>
            </Flex>
        )
    } else if(!query.token || !query.userId)
        return (
            <Wrapper size='small'>
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>Invalid password changes request</AlertTitle>
                </Alert>
                <Flex mt={2}>
                    <NextLink href="/login">
                        <Link ml="auto">Back to Login</Link>
                    </NextLink>
                </Flex>
            </Wrapper>
        )
    else
    return (
        <Wrapper size='small'>
            <Formik initialValues={initialValues} onSubmit={onChangePasswordSubmit}>
                {
                    ({isSubmitting}) => 
                    // !loading && data ? <Box>Please check your email</Box> :
                    (
                        <Form>
                            <InputField
                                name="newPassword"
                                placeholder="New Password"
                                lable="New Password"
                                type="password"
                            />
                            {tokenError && 
                                <Flex>
                                    <Box color="red" mr={2}>{tokenError}</Box>
                                    <NextLink href="/forgot-password">
                                        <Link>Go back to Forgot Password</Link>
                                    </NextLink>
                                </Flex>
                            }
                            <Button type="submit" colorScheme="teal" mt={4} isLoading={isSubmitting}>
                                Change Password
                            </Button>
                        </Form>
                    )
                }
            </Formik>
        </Wrapper>
    )
}

export default ChangePassword
