import { Alert, AlertIcon, AlertTitle, Box, Flex, Spinner, Button, Link } from "@chakra-ui/react"
import { useRouter } from "next/router"
import Layout from "../../../components/Layout"
import { UpdatePostInput, useMeQuery, usePostQuery, useUpdatePostMutation } from "../../../generated/graphql"
import NextLink from 'next/link'
import { Formik, Form } from "formik"
import InputField from "../../../components/InputField"

const PostEdit = () => {
    const router = useRouter()
    const postId = router.query.id as string

    const {data: meData, loading: meLoading} = useMeQuery()

    const {data: postData, loading: postLoading} = usePostQuery({variables: {id: postId}})

    const [updatePost, _] = useUpdatePostMutation()

    if(meLoading || postLoading)
    return (
        <Flex justifyContent="center" alignItems="center" minH="100vh">
            <Spinner h={40} w={40}/>
        </Flex>
    )

    if(!postData?.post)
    return (
        <Layout>
            <Alert status="error">
                <AlertIcon />
                <AlertTitle>Post not found</AlertTitle>
            </Alert>
            <Box mt={4}>
                <NextLink href="/">
                    <Button>Back to Homepage</Button>
                </NextLink>
            </Box>
        </Layout>
    )

    if(!meLoading && !postLoading && meData?.me?.id !== postData?.post?.userId.toString())
    return (
        <Layout>
            <Alert status="error">
                <AlertIcon />
                <AlertTitle>Unauthorised</AlertTitle>
            </Alert>
            <Box mt={4}>
                <NextLink href="/">
                    <Button>Back to Homepage</Button>
                </NextLink>
            </Box>
        </Layout>
    )

    const initialValues = {
        title: postData.post.title,
        text: postData.post.text,
    }

    const onUpdatePostSubmit = async (values: Omit<UpdatePostInput, 'id'>) => {
        await updatePost({
            variables: {updatePostInput: {
                id: postId,
                ...values
            }}
        })
        router.back()
    }

    return (
        <Layout>
            <Formik initialValues={initialValues} onSubmit={onUpdatePostSubmit}>
                    {
                        ({isSubmitting}) => (
                            <Form>
                                <InputField
                                    name="title"
                                    placeholder="Title"
                                    lable="Title"
                                    type="text"
                                />
                                <Box mt={4}>
                                    <InputField
                                        textarea
                                        name="text" 
                                        placeholder="Text" 
                                        lable="Text"
                                        type="textarea"
                                    />
                                </Box>
                                <Flex justifyContent="space-between" alignItems="center" mt={4}>
                                    <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
                                        Update Post
                                    </Button>
                                    <NextLink href="/">
                                        <Link>Go back to Homepage</Link>
                                    </NextLink>
                                </Flex>
                            </Form>
                        )
                    }
                </Formik>
            </Layout>
    )
}

export default PostEdit
