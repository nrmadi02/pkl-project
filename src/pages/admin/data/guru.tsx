import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Input, Popover, PopoverTrigger, Select, useDisclosure, useToast } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { CreateGuruSchema, createGuruSchema, UpdateGuruSchema, updateGuruSchema } from "../../../server/schema/guru.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DrawerForm from "../../../components/DrawerForm";
import { trpc } from "../../../utils/trpc";
import Image from "next/image";
import { Guru, Kelas } from "@prisma/client";
import DataTable from "../../../components/DataTable/DataTable";
import { getCookie } from "cookies-next";
import DeleteAlert from "../../../components/Alert/Delete";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const isDevelopment = process.env.NODE_ENV == "development"
    const token = getCookie(isDevelopment ? 'next-auth.session-token' : '__Secure-next-auth.session-token', { req: ctx.req, res: ctx.res })
    if (!token) {
        return {
            redirect: {
                destination: "/login?referer=admin",
                permanent: false,
            },
        };
    }
    return {
        props: {
        }
    }
}

const DataGuru: NextPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef<HTMLButtonElement>(null)
    const [show, setShow] = useState(false)
    const toast = useToast()
    const [file, setFile] = useState('')
    const [img, setImg] = useState()
    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting, isDirty, isValid } } = useForm<CreateGuruSchema>({
        resolver: zodResolver(createGuruSchema),
        mode: "onChange"
    });
    const [onCheck, setOnCheck] = useState(false)

    const handleChangeFile = (e: any) => {
        e.target?.files[0] && setFile(URL.createObjectURL(e.target?.files[0]))
        if (e.target?.files) {
            const filereader = new FileReader();
            filereader.readAsDataURL(e.target?.files[0]);
            filereader.onload = function (evt) {
                const base64 = evt.target?.result;
                setImg(e.target?.files[0])
                setValue("potoProfile", String(base64))
            }
        }
    }

    const { data: dataKelas } = trpc.useQuery(['kelas.getAll'])
    const { mutateAsync: tambahGuru } = trpc.useMutation(['guru.create'])
    const { data: dataGuru, isLoading, refetch } = trpc.useQuery(['guru.getAll'], {
        refetchOnWindowFocus: false
    })

    const getData = (data: Guru[] | undefined) => {
        const dataNew = data as Guru[]
        return dataNew
    }

    const columns = useMemo(() => [
        {
            Header: "Nama",
            accessor: (d: Guru) => {
                return <InfoGuru data={d} />
            }
        },
        {
            Header: "nama",
            accessor: "nama"
        },
        {
            Header: "email",
            accessor: "email"
        },
        {
            Header: "Nomor Induk",
            accessor: "nip"
        },
        {
            Header: "Jenis Kelamin",
            accessor: "jenisKelamin"
        },
        {
            Header: "Jabatan",
            accessor: "jenisGuru"
        },
        {
            Header: "Wali Kelas",
            accessor: (d: Guru) => {
                return d.waliKelas ? <p>Ya</p> : <p>Tidak</p>
            }
        },
        {
            Header: "Nama Kelas",
            accessor: (d: Guru) => {
                return d.waliKelas ? <p>{d.namaKelas}</p> : <p>-</p>
            }
        },
        {
            Header: "Action",
            accessor: (d: Guru) => {
                return <ActionTable key={d?.id} dataKelas={dataKelas?.result} value={d?.id} data={d} refetch={refetch} toast={toast} />
            },
        }
    ], [dataGuru?.result])

    const data = useMemo(() => getData(dataGuru?.result ? dataGuru.result : []), [dataGuru]);

    const handleAddGuru = useCallback(
        async (data: CreateGuruSchema) => {
            const result: any = await tambahGuru(data);
            if (result.status === 201) {
                // router.push("/")
                setFile('')
                onClose()
                toast({
                    title: 'Tambah data guru berhasil',
                    status: 'success',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
                refetch()
                // console.log(result)
            } else {
                toast({
                    title: 'Tambah data guru gagal',
                    status: 'error',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
            }
        },
        [tambahGuru]
    );

    useEffect(() => {
        const subs = watch((e) => {
            // console.log(e)
        })

        return () => subs.unsubscribe()
    }, [watch])

    useEffect(() => {
        file == '' && setValue('potoProfile', null)
    }, [file])

    return (
        <AdminLayout title='Guru' breadcrumb={(
            <Breadcrumb>
                <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Pendataan</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Guru</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        )}>
            <>
                <Head>
                    <title>SMABAT || Guru</title>
                    <meta name="description" content="Generated by create-t3-app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className="p-5">
                    <div className='w-full mb-5 flex justify-end items-end'>
                        <Button onClick={onOpen} ref={btnRef} leftIcon={<IoAdd />} fontWeight={600}
                            color={'white'}
                            bg={'orange.400'}
                            _hover={{
                                bg: 'orange.300',
                            }}>
                            Tambah data
                        </Button>
                    </div>
                    <div className="text-[14px]">
                        <DataTable isSearch sizeSet hiddenColumns={['nama', 'email']} isLoading={isLoading} columns={columns} data={data} />
                    </div>
                </div>
                <DrawerForm btnRef={btnRef} isOpen={isOpen} onClose={() => {
                    setFile('')
                    onClose()
                }} bottomButtons={
                    <>
                        <Button variant='outline' mr={3} onClick={() => {
                            setFile('')
                            onClose()
                        }}>
                            Batal
                        </Button>
                        <Button isLoading={isSubmitting} type='submit' form='my-form' fontWeight={600}
                            color={'white'}
                            bg={'orange.400'}
                            _hover={{
                                bg: 'orange.300',
                            }}>
                            Simpan
                        </Button>
                    </>
                }>
                    <div className='pt-5'>
                        <Heading size={'lg'} mb='5'>Tambah data guru</Heading>
                        <form id='my-form' onSubmit={handleSubmit(handleAddGuru)}>
                            <Flex w={'full'} flexDirection={'column'} gap={'10px'}>
                                <FormControl isInvalid={errors.potoProfile != undefined}>
                                    <FormLabel htmlFor='foto'>Foto (optional)</FormLabel>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                        id='input-file-upload'
                                        className="hidden"
                                        {...register('potoProfile')}
                                        onChange={handleChangeFile}
                                    />
                                    {!file && <label id="label-file-upload" htmlFor="input-file-upload">
                                        <div className="flex rounded hover:scale-[1.01] transition-all border-[1px] cursor-pointer border-orange-300 flex-col items-center justify-center w-[200px] h-[230px]">
                                            <IoAdd size={'50'} color='#F6AD55' />
                                        </div>
                                    </label>}
                                    {file && <label id="label-file-upload" htmlFor="input-file-upload">
                                        <div className="w-[200px] h-[230px] cursor-pointer hover:scale-[1.01] transition-all rounded-md border-[2px] border-orange-300">
                                            <Image className="rounded-md" width={200} height={230} alt='_img' src={file} />
                                        </div>

                                    </label>}
                                    {/* <FormErrorMessage>
                                        {errors.potoProfile && errors.potoProfile.message?.toString()}
                                    </FormErrorMessage> */}
                                </FormControl>
                                <FormControl isInvalid={errors.nama != undefined}>
                                    <FormLabel htmlFor='name'>Nama Guru</FormLabel>
                                    <Input
                                        bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                        id='nama'
                                        placeholder='Masukan nama guru'
                                        {...register('nama')}
                                    />
                                    <FormErrorMessage>
                                        {errors.nama && errors.nama.message}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={errors.email != undefined}>
                                    <FormLabel htmlFor='email'>Email</FormLabel>
                                    <Input
                                        bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                        id='email'
                                        placeholder='Masukan email'
                                        {...register('email', {
                                            required: 'This is required',
                                        })}
                                    />
                                    <FormErrorMessage>
                                        {errors.email && errors.email.message}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={errors.nip != undefined}>
                                    <FormLabel htmlFor='nomorInduk'>Nomor Induk</FormLabel>
                                    <Input
                                        bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                        id='nip'
                                        placeholder='Masukan nomor induk'
                                        {...register('nip')}
                                    />
                                    <FormErrorMessage>
                                        {errors.nip && errors.nip.message}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={errors.jenisGuru != undefined}>
                                    <FormLabel htmlFor='jenisGuru'>Jabatan</FormLabel>
                                    <Input
                                        bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                        id='jenisGuru'
                                        placeholder='Masukan jenis guru'
                                        {...register('jenisGuru')}
                                    />
                                    <FormErrorMessage>
                                        {errors.jenisGuru && errors.jenisGuru.message}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={errors.jenisKelamin != undefined}>
                                    <FormLabel htmlFor='jenisKelamin'>Jenis Kelamin</FormLabel>
                                    <Select bg={'white'} borderColor={'orange.300'} borderWidth={1} id='jenisKelamin' placeholder='Pilih jenis kelamin' {...register('jenisKelamin')}>
                                        <option value={'Laki-laki'}>Laki-laki</option>
                                        <option value={'Perempuan'}>Perempuan</option>
                                    </Select>
                                    <FormErrorMessage>
                                        {errors.jenisKelamin && "Jenis kelamin harus di isi"}
                                    </FormErrorMessage>
                                </FormControl>
                                <Checkbox {...register('waliKelas')} defaultChecked={onCheck} onChange={() => setOnCheck(!onCheck)}>Wali Kelas (optional)</Checkbox>
                                {onCheck ? <FormControl isInvalid={errors.namaKelas != undefined}>
                                    <FormLabel htmlFor='namaKelas'>Pilih Kelas</FormLabel>
                                    <Select bg={'white'} borderColor={'orange.300'} borderWidth={1} id='namaKelas' placeholder='Pilih kelas' {...register('namaKelas')}>
                                        {dataKelas && dataKelas.result.map((itm, idx) => {
                                            return <option key={idx} value={itm.name}>{itm.name}</option>
                                        })}
                                    </Select>
                                    <FormErrorMessage>
                                        {errors.namaKelas && "Nama kelas harus di isi"}
                                    </FormErrorMessage>
                                </FormControl> : null}
                            </Flex>
                        </form>
                    </div>
                </DrawerForm>
            </>
        </AdminLayout>
    )
}

export default DataGuru

interface InfoGuru {
    data: Guru
}

const InfoGuru = ({ data }: InfoGuru) => {
    return (
        <div className="flex flex-row items-center gap-x-[10px]">
            <div className="w-[60px] h-[60px]">
                <Image className="rounded-full" width={60} height={60} alt="_profile" src={data.fotoProfile ? data.fotoProfile : `https://ui-avatars.com/api/?name=${data.nama.split(' ').join('+')}`} />
            </div>
            <div className="flex flex-col gap-y-[5px]">
                <p className="font-bold">{data.nama}</p>
                <p>{data.email}</p>
            </div>
        </div>
    )
}

interface ActionValue {
    value: any,
    refetch: any,
    toast: any,
    data: Guru
    dataKelas: Kelas[] | undefined
}

const ActionTable = ({ value, data, refetch, toast, dataKelas }: ActionValue) => {
    const { onOpen, onClose, isOpen } = useDisclosure()
    const { onOpen: onOpenDel, onClose: onCloseDel, isOpen: isOpenDel } = useDisclosure()
    const firstFieldRef = useRef(null)
    const [delLoading, setDelLoading] = useState(false)
    const [file, setFile] = useState('')
    const [img, setImg] = useState()
    const [onCheck, setOnCheck] = useState(false)

    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting, isDirty, isValid } } = useForm<UpdateGuruSchema>({
        resolver: zodResolver(updateGuruSchema),
        mode: "onChange"
    });

    const handleChangeFile = (e: any) => {
        e.target?.files[0] && setFile(URL.createObjectURL(e.target?.files[0]))
        if (e.target?.files) {
            const filereader = new FileReader();
            filereader.readAsDataURL(e.target?.files[0]);
            filereader.onload = function (evt) {
                const base64 = evt.target?.result;
                setImg(e.target?.files[0])
                setValue("potoProfile", String(base64))
            }
        }
    }

    const { mutateAsync: hapusGuru } = trpc.useMutation(['guru.delete'])
    const { mutateAsync: editGuru } = trpc.useMutation('guru.update')

    const handleUpdateGuru = useCallback(
        async (d: UpdateGuruSchema) => {
            const updateGuru = await editGuru(d)
            if (updateGuru.status === 200) {
                toast({
                    title: 'Edit data guru berhasil',
                    status: 'success',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
                refetch()
                setDelLoading(false)
                onClose()
            } else {
                toast({
                    title: 'Edit data guru gagal',
                    status: 'error',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
                setDelLoading(false)
            }
        }, []
    )

    const handleDeleteGuru = useCallback(
        async (id: string) => {
            const delGuru = await hapusGuru({
                id: id
            })
            if (delGuru.status === 200) {
                toast({
                    title: 'Hapus data guru berhasil',
                    status: 'success',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
                refetch()
                setDelLoading(false)
                onCloseDel()
            } else {
                toast({
                    title: 'Hapus data guru gagal',
                    status: 'error',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
                setDelLoading(false)
            }
        }, []
    )

    return (
        <Flex alignItems={'center'} gap={'2'}>
            <IconButton
                // isLoading={delLoading}
                variant='outline'
                colorScheme='orange'
                aria-label='update'
                fontSize='20px'
                onClick={async () => {
                    onOpen()
                    setValue('email', data.email)
                    setValue('id', data.id)
                    setValue('jenisGuru', data.jenisGuru)
                    setValue('jenisKelamin', data.jenisKelamin)
                    setValue('nama', data.nama)
                    setValue('nip', data.nip)
                    setValue('namaKelas', data.namaKelas!)
                    setValue('potoProfile', null)
                    setValue('waliKelas', data.waliKelas)
                    data.fotoProfile ? setFile(data.fotoProfile) : setFile('')
                    data.waliKelas ? setOnCheck(true) : setOnCheck(false)
                }}
                icon={<IoPencil />}
            />
            <IconButton
                isLoading={delLoading}
                variant='outline'
                colorScheme='red'
                aria-label='delete'
                fontSize='20px'
                onClick={async () => {
                    onOpenDel()
                }}
                icon={<IoTrash />}
            />
            <DeleteAlert isOpen={isOpenDel} onClick={async () => {
                setDelLoading(true)
                await handleDeleteGuru(data.id)
            }} onClose={onCloseDel} onOpen={onOpenDel} isLoading={delLoading} title={'Hapus guru'} text={'Apa anda yakin ?'} />
            <DrawerForm btnRef={firstFieldRef} isOpen={isOpen} onClose={() => {
                onClose()
            }} bottomButtons={
                <>
                    <Button variant='outline' mr={3} onClick={() => {
                        onClose()
                    }}>
                        Batal
                    </Button>
                    <Button isLoading={isSubmitting} type='submit' form='form-update' fontWeight={600}
                        color={'white'}
                        bg={'orange.400'}
                        _hover={{
                            bg: 'orange.300',
                        }}>
                        Update
                    </Button>
                </>
            }>
                <div className='pt-5'>
                    <Heading size={'lg'} mb='5'>Edit data guru</Heading>
                    <form id='form-update' onSubmit={handleSubmit(handleUpdateGuru)}>
                        <Flex w={'full'} flexDirection={'column'} gap={'10px'}>
                            <FormControl isInvalid={errors.potoProfile != undefined}>
                                <FormLabel htmlFor='foto'>Foto (optional)</FormLabel>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                    id='input-file-upload'
                                    className="hidden"
                                    {...register('potoProfile')}
                                    onChange={handleChangeFile}
                                />
                                {!file && <label id="label-file-upload" htmlFor="input-file-upload">
                                    <div className="flex rounded hover:scale-[1.01] transition-all border-[1px] cursor-pointer border-orange-300 flex-col items-center justify-center w-[200px] h-[230px]">
                                        <IoAdd size={'50'} color='#F6AD55' />
                                    </div>
                                </label>}
                                {file && <label id="label-file-upload" htmlFor="input-file-upload">
                                    <div className="w-[200px] h-[230px] cursor-pointer hover:scale-[1.01] transition-all rounded-md border-[2px] border-orange-300">
                                        <Image className="rounded-md" width={200} height={230} alt='_img' src={file} />
                                    </div>

                                </label>}
                                {/* <FormErrorMessage>
                                        {errors.potoProfile && errors.potoProfile.message?.toString()}
                                    </FormErrorMessage> */}
                            </FormControl>
                            <Input
                                bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                id='id'
                                type={'hidden'}
                                // placeholder='Masukan nama guru'
                                {...register('id')}
                            />
                            <FormControl isInvalid={errors.nama != undefined}>
                                <FormLabel htmlFor='name'>Nama Guru</FormLabel>
                                <Input
                                    bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                    id='nama'
                                    placeholder='Masukan nama guru'
                                    {...register('nama')}
                                />
                                <FormErrorMessage>
                                    {errors.nama && errors.nama.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.email != undefined}>
                                <FormLabel htmlFor='email'>Email</FormLabel>
                                <Input
                                    bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                    id='email'
                                    placeholder='Masukan email'
                                    {...register('email', {
                                        required: 'This is required',
                                    })}
                                />
                                <FormErrorMessage>
                                    {errors.email && errors.email.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.nip != undefined}>
                                <FormLabel htmlFor='nomorInduk'>Nomor Induk</FormLabel>
                                <Input
                                    bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                    id='nip'
                                    placeholder='Masukan nomor induk'
                                    {...register('nip')}
                                />
                                <FormErrorMessage>
                                    {errors.nip && errors.nip.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.jenisGuru != undefined}>
                                <FormLabel htmlFor='jenisGuru'>Jabatan</FormLabel>
                                <Input
                                    bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                    id='jenisGuru'
                                    placeholder='Masukan jenis guru'
                                    {...register('jenisGuru')}
                                />
                                <FormErrorMessage>
                                    {errors.jenisGuru && errors.jenisGuru.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.jenisKelamin != undefined}>
                                <FormLabel htmlFor='jenisKelamin'>Jenis Kelamin</FormLabel>
                                <Select bg={'white'} borderColor={'orange.300'} borderWidth={1} id='jenisKelamin' placeholder='Pilih jenis kelamin' {...register('jenisKelamin')}>
                                    <option value={'Laki-laki'}>Laki-laki</option>
                                    <option value={'Perempuan'}>Perempuan</option>
                                </Select>
                                <FormErrorMessage>
                                    {errors.jenisKelamin && "Jenis kelamin harus di isi"}
                                </FormErrorMessage>
                            </FormControl>
                            <Checkbox {...register('waliKelas')} defaultChecked={onCheck} onChange={() => setOnCheck(!onCheck)}>Wali Kelas (optional)</Checkbox>
                            {onCheck ? <FormControl isInvalid={errors.namaKelas != undefined}>
                                <FormLabel htmlFor='namaKelas'>Pilih Kelas</FormLabel>
                                <Select bg={'white'} borderColor={'orange.300'} borderWidth={1} id='namaKelas' placeholder='Pilih kelas' {...register('namaKelas')}>
                                    {dataKelas && dataKelas.map((itm, idx) => {
                                        return <option key={idx} value={itm.name}>{itm.name}</option>
                                    })}
                                </Select>
                                <FormErrorMessage>
                                    {errors.namaKelas && "Nama kelas harus di isi"}
                                </FormErrorMessage>
                            </FormControl> : null}
                        </Flex>
                    </form>
                </div>
            </DrawerForm>
        </Flex>
    )
}