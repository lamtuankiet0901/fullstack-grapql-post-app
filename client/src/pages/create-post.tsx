import { Flex, Spinner, Box, Button, Link } from "@chakra-ui/react"
import { useCheckAuth } from "../utils/useCheckAuth"
import Layout from "../components/Layout"
import { Formik, Form } from "formik"
import { CreatePostInput, useCreatePostMutation } from "../generated/graphql"
import InputField from "../components/InputField"
import NextLink from 'next/link'
import router from "next/router"


const CreatePost = () => {
    const {data: authData, loading: authLoading} = useCheckAuth()

    const initialValues: CreatePostInput = {
        title: '',
        text: '',
    }
    
    const [createPost, _] = useCreatePostMutation()

    const onCreatePostSubmit = async (values: CreatePostInput) => {
        await createPost({
            variables: {
                createPostInput: values
            },
            update(cache, {data}){
                cache.modify({
                    fields: {
                        posts(existing){
                            if(data?.createPost.success && data.createPost.post){
                                const newPostRef = cache.identify(data.createPost.post)

                                const newPostAfterCreation = {
                                    ...existing,
                                    totalCount: existing.totalCount + 1,
                                    paginatedPosts: [
                                        {__ref: newPostRef},
                                        ...existing.paginatedPosts
                                    ]
                                }
                                
                                return newPostAfterCreation
                            }

                        }
                    }
                })
            }
        })
        router.push('/')
    }

    if (authLoading || (!authLoading && !authData?.me)){
        return (
            <Flex justifyContent="center" alignItems="center" minH="100vh">
                <Spinner h={40} w={40}/>
            </Flex>
        )
    }
    else{
        return (
            <Layout>
                <Formik initialValues={initialValues} onSubmit={onCreatePostSubmit}>
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
                                            Create Post
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

}

export default CreatePost
