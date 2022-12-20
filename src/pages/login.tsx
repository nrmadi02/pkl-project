import type { NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginUserInput, loginUserSchema } from "../server/schema/user.schema";
import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, InputGroup, InputRightElement, Stack, Text, useColorModeValue, useToast } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Login: NextPage = () => {
  const toast = useToast()
  const [show, setShow] = useState(false)
  const [errMessage, setMessage] = useState('')
  const router = useRouter()

  const { register, handleSubmit, watch, formState: { errors, isSubmitting, isValid } } = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
    mode: "onChange"
  });

  const handleClick = () => setShow(!show)

  const onSubmit = useCallback(async (data: LoginUserInput) => {
    const result = await signIn("credentials", { ...data, redirect: false })
    if (result?.error) {
      toast({
        title: result.error,
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true,
      })
      setMessage(result.error)
    }
    if (result?.ok) {
      toast({
        title: 'Login Berhasil',
        status: 'success',
        duration: 3000,
        position: 'top-right',
        isClosable: true,
      })
      if(router.query?.referer){
        router.replace(router.query.referer?.toString() || '/')
      } else {
        router.replace('/')
      }
      
    }
  }, [router, toast]);

  useEffect(() => {
    const subs = watch((e) => {
      setMessage("")
    })

    return () => subs.unsubscribe()
  }, [watch])

  return (
    <>
      <Head>
        <title>Next App - Login</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Silahkan login</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              Pastikan data yang anda isi benar...
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <FormControl isInvalid={errors.nomorInduk != undefined}>
                  <FormLabel htmlFor='name'>NIP atau NIS</FormLabel>
                  <Input
                    id='nomorInduk'
                    placeholder='Masukan NIS atau NIP'
                    {...register('nomorInduk')}
                  />
                  <FormErrorMessage>
                    {errors.nomorInduk && errors.nomorInduk.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.password != undefined}>
                  <FormLabel htmlFor='password'>Password</FormLabel>
                  <InputGroup size='md'>
                    <Input
                      type={show ? 'text' : 'password'}
                      id='password'
                      placeholder='Masukan password'
                      {...register('password')}
                    />
                    <InputRightElement h={'full'}>
                      <Button
                        variant={'ghost'}
                        onClick={handleClick}>
                        {show ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.password && errors.password.message}
                  </FormErrorMessage>
                </FormControl>
                <Text color="red.500" fontSize="small">
                  {errMessage.length != 0 && errMessage}
                </Text>
                <Button disabled={!isValid} mt={4} fontWeight={600}
                  color={'white'}
                  bg={'orange.400'}
                  _hover={{
                    bg: 'orange.300',
                  }} isLoading={isSubmitting} type='submit'>
                  Login
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>

    </>
  );
};

export default Login;