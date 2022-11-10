import { CalendarIcon, DeleteIcon } from "@chakra-ui/icons";
import { Badge, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Input, Popover, PopoverArrow, PopoverCloseButton, PopoverContent, PopoverTrigger, Select, Spinner, Textarea, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pelanggaran, Siswa } from "@prisma/client";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { getCookie } from "cookies-next";
import moment from "moment";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoAdd, IoCalendarClear, IoRemove, IoTrash } from "react-icons/io5";
import { MdClear } from 'react-icons/md'
import DeleteAlert from "../../../../components/Alert/Delete";
import DataTable from "../../../../components/DataTable/DataTable";
import DrawerForm from "../../../../components/DrawerForm";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import SafeHydrate from "../../../../components/SafeHydrate";
import prismaFront from "../../../../server/db/front";
import { CreatePelanggaranSchema, createPelanggaranSchema } from "../../../../server/schema/pelanggaran.schema";
import { createTindakSchema, CreateTindakSchema } from "../../../../server/schema/tindak.schema";
import { trpc } from "../../../../utils/trpc";

export const getServerSideProps: GetServerSideProps<{ data: Siswa }> = async (ctx) => {
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

    const siswa = await prismaFront.siswa.findFirst({
        where: {
            id: String(ctx.params?.idx)
        }
    }) as unknown as Siswa

    if (!siswa) {
        return {
            redirect: {
                destination: "/admin/data/siswa",
                permanent: false,
            },
        };
    }

    return {
        props: {
            data: JSON.parse(JSON.stringify(siswa))
        }
    }
}

const DetailSiswa: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { data: stateSession } = useSession();
    const { onOpen, onClose, isOpen } = useDisclosure()
    const firstFieldRef = useRef(null)
    const { onOpen: onOpenTindak, onClose: onCloseTindak, isOpen: isOpenTindak } = useDisclosure()
    const btnTindakan = useRef(null)
    const { onOpen: onOpenDelTindak, onClose: onCloseDelTindak, isOpen: isOpenDelTindak } = useDisclosure()
    const toast = useToast()
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [selectedType, setSelectedType] = useState('')

    const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting, isDirty, isValid } } = useForm<CreatePelanggaranSchema>({
        resolver: zodResolver(createPelanggaranSchema),
        mode: "onChange"
    });

    const { register: registerTindak, handleSubmit: submitTindak, watch: watchTindak, setValue: setValueTindak, reset: resetTindak, formState: { errors: errorsTindak, isSubmitting: isSubmitTindak, isDirty: isDirtyTindak, isValid: isValidTindak } } = useForm<CreateTindakSchema>({
        resolver: zodResolver(createTindakSchema),
        mode: "onChange"
    });

    const { mutateAsync: tambahPelanggaran } = trpc.useMutation('pelanggaran.create')
    const { mutateAsync: tambahTindakan } = trpc.useMutation('tindak.create')
    const { data: dataSiswa, isLoading, refetch } = trpc.useQuery(['siswa.getByID', { id: data.id, type: selectedType, star_date: selectedDates[0] ? moment(selectedDates[0]).format('YYYY-MM-DD') : '', end_date: selectedDates[1] ? moment(selectedDates[1]).format('YYYY-MM-DD') : '' }])
    const { data: dataTindakan, isLoading: isLoadingTindakan, refetch: refetchTindak } = trpc.useQuery(['tindak.getByIDSiswa', String(dataSiswa?.result?.id)])
    const { mutateAsync: hapusTindakan, isLoading: loadingDelTindakan } = trpc.useMutation('tindak.delete')

    const handleAddPelanggaran = useCallback(
        async (data: CreatePelanggaranSchema) => {
            const result: any = await tambahPelanggaran(data);
            if (result.status === 201) {
                onClose()
                reset()
                toast({
                    title: 'Tambah Point siswa berhasil',
                    status: 'success',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
                refetch()
            } else if (result.status === 400) {
                toast({
                    title: 'Penghargaan tidak bisa diberikan karena point pelanggaran siswa lebih kecil',
                    status: 'error',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
            } else {
                toast({
                    title: 'Tambah Point siswa gagal',
                    status: 'error',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
            }
        },
        [tambahPelanggaran]
    );

    const handleAddTindakan = useCallback(
        async (data: CreateTindakSchema) => {
            const result: any = await tambahTindakan(data);
            if (result.status === 201) {
                onCloseTindak()
                resetTindak()
                toast({
                    title: 'Tambah Tindak lanjut berhasil',
                    status: 'success',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
                refetchTindak()
            } else {
                toast({
                    title: 'Tambah Tindak lanjut gagal',
                    status: 'error',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
            }
        },
        [tambahPelanggaran]
    );

    const handleDeleteTindakan = useCallback(
        async (id: string) => {
            const delTindak = await hapusTindakan(id)
            if (delTindak.status === 200) {
                toast({
                    title: 'Hapus data tindakan berhasil',
                    status: 'success',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
                refetchTindak()
                onCloseDelTindak()
                // setDelLoading(false)
            } else {
                toast({
                    title: 'Hapus data tindakan gagal',
                    status: 'error',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
                // setDelLoading(false)
            }
        }, []
    )

    const PanggilanSatu = () => {
        return (
            <>
                <Badge colorScheme='yellow'>Panggilan 1</Badge>
            </>
        )
    }

    const PanggilanDua = () => {
        return (
            <>
                <Badge colorScheme='orange'>Panggilan 2</Badge>
            </>
        )
    }

    const PanggilanTiga = () => {
        return (
            <>
                <Badge colorScheme='red'>Panggilan 3</Badge>
            </>
        )
    }

    const Aman = () => {
        return (
            <>
                <Badge colorScheme='green'>Aman</Badge>
            </>
        )
    }

    const getData = (data: Pelanggaran[] | undefined) => {
        const dataNew = data as Pelanggaran[]
        return dataNew
    }

    const columns = useMemo(() => [
        {
            Header: "Jenis Point",
            accessor: (d: Pelanggaran) => {
                return d.type == "Penghargaan" ? <Badge colorScheme={'green'}>{d.type}</Badge> : <Badge colorScheme={'red'}>{d.type}</Badge>
            }
        },
        {
            Header: "jenis_point",
            accessor: "type"
        },
        {
            Header: "Deskripsi",
            accessor: "deskripsi"
        },
        {
            Header: "point",
            accessor: "point"
        },
        {
            Header: "Point",
            accessor: (d: Pelanggaran) => {
                return +Math.abs(d.point)
            }
        },
        {
            Header: "Dibuat",
            accessor: (d: Pelanggaran) => {
                const date = moment(d.createdAt).format('DD/MM/YYYY')
                return <p>{date}</p>
            }
        },
        {
            Header: "Action",
            accessor: (d: Pelanggaran) => {

                return <ActionTable
                    key={d?.id} value={d?.id} data={d} refetch={refetch} toast={toast} />
            },
        }
    ], [dataSiswa?.pelanggaran])

    const dataPelanggaran = useMemo(() => getData(dataSiswa?.pelanggaran ? dataSiswa.pelanggaran : []), [dataSiswa]);

    return (
        <AdminLayout title='Detail Siswa' breadcrumb={(
            <Breadcrumb>
                <BreadcrumbItem>
                    <BreadcrumbLink>Pendataan</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Link href={'/admin/data/siswa'}>
                        <BreadcrumbLink>Siswa</BreadcrumbLink>
                    </Link>
                </BreadcrumbItem>
            </Breadcrumb>
        )}>
            <>
                <Head>
                    <title>SMABAT || Detail Siswa</title>
                    <meta name="description" content="Generated by create-t3-app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className="p-5">
                    <Heading size={'md'}>Data Siswa</Heading>
                    <div className="flex flex-col md:flex-row gap-x-20 gap-y-5">
                        <div className="flex flex-row gap-5 mt-5">
                            <div className="w-[190px] h-[220px] md:w-[200px] md:h-[230px] cursor-pointer hover:scale-[1.01] transition-all rounded-md border-[2px] border-orange-300">
                                <Image className="rounded-md" width={200} height={230} alt='_img' src={data.fotoProfile ? data.fotoProfile : `https://ui-avatars.com/api/?name=${data.nama.split(' ').join('+')}`} />
                            </div>
                            <SafeHydrate>
                                <div className="flex gap-3 flex-col text-[18px] md:text-[20px]">
                                    <tr>
                                        <td width={70} className="font-bold">Nama</td>
                                        <td width={20}>:</td>
                                        <td>{data.nama}</td>
                                    </tr>
                                    <tr>
                                        <td width={70} className="font-bold">NIS</td>
                                        <td width={20}>:</td>
                                        <td>{data.nis}</td>
                                    </tr>
                                    <tr>
                                        <td width={70} className="font-bold">Kelas</td>
                                        <td width={20}>:</td>
                                        <td>{data.kelas}</td>
                                    </tr>
                                    <tr>
                                        <td width={70} className="font-bold">Point</td>
                                        <td width={20}>:</td>
                                        <td>{dataSiswa?.points}</td>
                                    </tr>
                                    <tr>
                                        <td width={70} className="font-bold">Status</td>
                                        <td width={20}>:</td>
                                        <td>
                                            {Number(dataSiswa?.points) < 15 && <Aman />}
                                            {Number(dataSiswa?.points) >= 15 && Number(dataSiswa?.points) < 30 && <PanggilanSatu />}
                                            {Number(dataSiswa?.points) >= 30 && Number(dataSiswa?.points) < 45 && <PanggilanDua />}
                                            {Number(dataSiswa?.points) >= 45 && <PanggilanTiga />}
                                        </td>
                                    </tr>
                                </div>
                            </SafeHydrate>
                        </div>
                        <div className="md:mt-5">
                            <Heading size={'md'}>Tindak Lanjut</Heading>
                            <div className="flex flex-col gap-2 mt-5">
                                {!isLoadingTindakan ? (
                                    dataTindakan?.result.length != 0 ? dataTindakan?.result.map((itm, idx) => {
                                        return (
                                            <div className="flex flex-row items-center gap-2">
                                                <Tooltip key={idx} label={itm.deskripsi} aria-label='A tooltip'>
                                                    <p className="cursor-pointer">- {itm.type} - {moment(itm.createdAt).format('DD/MM/YYYY')}</p>
                                                </Tooltip>
                                                <IconButton
                                                    variant='ghost'
                                                    size={'sm'}
                                                    colorScheme={'orange'}
                                                    aria-label='update'
                                                    fontSize='18px'
                                                    onClick={async () => {
                                                        onOpenDelTindak()
                                                    }}
                                                    icon={<DeleteIcon />}
                                                />
                                                <DeleteAlert isOpen={isOpenDelTindak} onClick={async () => {
                                                    // setDelLoading(true)
                                                    await handleDeleteTindakan(itm.id)
                                                }} onClose={onCloseDelTindak} onOpen={onOpenDelTindak} isLoading={loadingDelTindakan} title={'Hapus tindak lanjut'} text={'Apa anda yakin ?'} />
                                            </div>
                                        )
                                    }) : <p>-</p>
                                ) : <Spinner color='orange.500' />}
                            </div>
                            <Popover
                                isOpen={isOpenTindak}
                                initialFocusRef={btnTindakan}
                                onOpen={() => {
                                    onOpenTindak()
                                    setValueTindak('siswaID', String(dataSiswa?.result?.id))
                                    setValueTindak('penindak', stateSession?.user?.name ? stateSession?.user?.name : '')
                                }}
                                onClose={() => {
                                    onCloseTindak()
                                    resetTindak()
                                }}
                                placement={'auto-start'}
                                closeOnBlur={false}
                            >
                                <PopoverTrigger>
                                    <Button fontWeight={600}
                                        color={'white'}
                                        bg={'orange.400'}
                                        _hover={{
                                            bg: 'orange.300',
                                        }} mt={'10px'}>
                                        Beri tindakan
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent p={5}>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <form onSubmit={submitTindak(handleAddTindakan)}>
                                        <Flex w={'full'} flexDirection={'column'} gap={'10px'}>
                                            <Input
                                                bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                                id='id'
                                                type={'hidden'}
                                                // placeholder='Masukan nama guru'
                                                {...registerTindak('siswaID')}
                                            />
                                            <Input
                                                bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                                id='id'
                                                type={'hidden'}
                                                // placeholder='Masukan nama guru'
                                                {...registerTindak('penindak')}
                                            />
                                            <FormControl isInvalid={errorsTindak.type != undefined}>
                                                <FormLabel htmlFor='type'>Jenis Tindakan</FormLabel>
                                                <Input
                                                    bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                                    id='type'
                                                    placeholder='Masukan jenis tindakan'
                                                    {...registerTindak('type')}
                                                />
                                                <FormErrorMessage>
                                                    {errorsTindak.type && errorsTindak.type.message}
                                                </FormErrorMessage>
                                            </FormControl>
                                            <FormControl isInvalid={errorsTindak.deskripsi != undefined}>
                                                <FormLabel htmlFor='deskripsi'>Deskripsi</FormLabel>
                                                <Textarea
                                                    bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                                    id='deskripsi'
                                                    placeholder='Masukan deskripsi'
                                                    {...registerTindak('deskripsi')}
                                                />
                                                <FormErrorMessage>
                                                    {errorsTindak.deskripsi && errorsTindak.deskripsi.message}
                                                </FormErrorMessage>
                                            </FormControl>
                                        </Flex>
                                        <Button disabled={!isValidTindak} isLoading={isSubmitTindak} type='submit' fontWeight={600}
                                            color={'white'}
                                            bg={'orange.400'}
                                            _hover={{
                                                bg: 'orange.300',
                                            }} mt={'10px'}>
                                            Tambah
                                        </Button>
                                    </form>
                                </PopoverContent>
                            </Popover>

                        </div>
                    </div>
                    <div className="mt-5 flex flex-col gap-3">
                        <Heading size={'md'}>Data Point Siswa</Heading>
                        <div className='w-full mb-3 flex justify-end items-end'>
                            <Button onClick={() => {
                                onOpen()
                                setValue('siswaID', data?.id)
                                setValue('pemeberi', stateSession?.user?.name ? stateSession?.user?.name : '')
                            }} ref={firstFieldRef} leftIcon={<IoAdd />} fontWeight={600}
                                color={'white'}
                                bg={'orange.400'}
                                _hover={{
                                    bg: 'orange.300',
                                }}>
                                Tambah Point
                            </Button>
                        </div>
                        <div className="relative hidden md:block pl-36 mb-3">
                            <RangeDatepicker
                                propsConfigs={{
                                    inputProps: {
                                        borderColor: 'orange.300',
                                        borderWidth: '2px',
                                        bg: 'white'
                                    },
                                    dateNavBtnProps: {
                                        colorScheme: "orange",
                                        variant: "outline"
                                    },
                                    dayOfMonthBtnProps: {

                                        defaultBtnProps: {
                                            // borderColor: "red.300",
                                            _hover: {
                                                background: "orange.400",
                                                color: "white",
                                            }
                                        },
                                        isInRangeBtnProps: {
                                            color: "white",
                                            bg: 'orange.300'
                                        },
                                        selectedBtnProps: {
                                            background: "orange.400",
                                            color: "white",
                                        },
                                    },

                                }}
                                selectedDates={selectedDates}
                                onDateChange={setSelectedDates}
                            />
                            <div className="absolute top-1 right-1">
                                <IconButton
                                    variant='ghost'
                                    size={'sm'}
                                    colorScheme={selectedDates.length != 0 ? 'orange' : 'blackAlpha'}
                                    aria-label='update'
                                    fontSize='20px'
                                    onClick={async () => {
                                        setSelectedDates([])
                                    }}
                                    icon={<MdClear />}
                                />
                            </div>
                            <div className="absolute gap-3 flex flex-row items-center top-[4px] left-0">
                                <p className="font-bold">Filter waktu</p>
                                <CalendarIcon fontSize={'20px'} color={'orange.300'} />
                            </div>
                        </div>
                        <div className="mb-3 flex flex-row items-center">
                            <p className="font-bold">Jenis Point</p>
                            <Select onChange={(e) => setSelectedType(e.target.value)} bg={'white'} borderColor={'orange.300'} borderWidth={2} placeholder='Pilih...'>
                                <option value={'Kelakuan'}>Kelakuan</option>
                                <option value={'Kerajinan'}>Kerajinan</option>
                                <option value={'Kerapian'}>Kerapian</option>
                                <option value={'Penghargaan'}>Penghargaan</option>
                            </Select>
                        </div>
                        <DrawerForm btnRef={firstFieldRef} isOpen={isOpen} onClose={() => {
                            onClose()
                            reset()
                        }} bottomButtons={
                            <>
                                <Button variant='outline' mr={3} onClick={() => {
                                    onClose()
                                    reset()
                                }}>
                                    Batal
                                </Button>
                                <Button isLoading={isSubmitting} disabled={!isValid} type='submit' form='form-update' fontWeight={600}
                                    color={'white'}
                                    bg={'orange.400'}
                                    _hover={{
                                        bg: 'orange.300',
                                    }}>
                                    Tambah
                                </Button>
                            </>
                        }>
                            <div className='pt-5'>
                                <Heading size={'lg'} mb='5'>Tambah point</Heading>
                                <form className="mt-5" id='form-update' onSubmit={handleSubmit(handleAddPelanggaran)}>
                                    <Flex w={'full'} flexDirection={'column'} gap={'10px'}>
                                        <Input
                                            bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                            id='id'
                                            type={'hidden'}
                                            // placeholder='Masukan nama guru'
                                            {...register('siswaID')}
                                        />
                                        <Input
                                            bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                            id='id'
                                            type={'hidden'}
                                            // placeholder='Masukan nama guru'
                                            {...register('pemeberi')}
                                        />
                                        <FormControl isInvalid={errors.point != undefined}>
                                            <FormLabel htmlFor='point'>Point</FormLabel>
                                            <Input
                                                bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                                id='point'
                                                placeholder='Masukan point'
                                                type={"number"}
                                                {...register('point')}
                                            />
                                            <FormErrorMessage>
                                                {errors.point && errors.point.message}
                                            </FormErrorMessage>
                                        </FormControl>
                                        <FormControl isInvalid={errors.deskripsi != undefined}>
                                            <FormLabel htmlFor='deskripsi'>Deskripsi</FormLabel>
                                            <Textarea
                                                bg={'white'} borderColor={'orange.300'} borderWidth={1}
                                                id='deskripsi'
                                                placeholder='Masukan deskripsi'
                                                {...register('deskripsi')}
                                            />
                                            <FormErrorMessage>
                                                {errors.deskripsi && errors.deskripsi.message}
                                            </FormErrorMessage>
                                        </FormControl>
                                        <FormControl isInvalid={errors.type != undefined}>
                                            <FormLabel htmlFor='type'>Jenis Tata Tertib</FormLabel>
                                            <Select bg={'white'} borderColor={'orange.300'} borderWidth={1} id='type' placeholder='Pilih...' {...register('type')}>
                                                <option value={'Kelakuan'}>Kelakuan</option>
                                                <option value={'Kerajinan'}>Kerajinan</option>
                                                <option value={'Kerapian'}>Kerapian</option>
                                                <option value={'Penghargaan'}>Penghargaan</option>
                                            </Select>
                                            <FormErrorMessage>
                                                {errors.type && "Jenis tata tertib harus di pilih"}
                                            </FormErrorMessage>
                                        </FormControl>
                                    </Flex>
                                </form>
                            </div>
                        </DrawerForm>
                        <DataTable isLoading={isLoading} hiddenColumns={['type', 'point']} columns={columns} data={dataPelanggaran} />
                    </div>
                </div>
            </>
        </AdminLayout >
    )
}

export default DetailSiswa

interface ActionValue {
    value: any,
    refetch: any,
    toast: any,
    data: Siswa | any
}

const ActionTable = ({ value, data, refetch, toast }: ActionValue) => {
    const { data: stateSession } = useSession();
    const { onOpen, onClose, isOpen } = useDisclosure()
    const [delLoading, setDelLoading] = useState(false)

    const { mutateAsync: hapusPelanggaran } = trpc.useMutation(['pelanggaran.delete'])

    const handleDeletePoint = useCallback(
        async (id: string) => {
            const delPoint = await hapusPelanggaran(id)
            if (delPoint.status === 200) {
                toast({
                    title: 'Hapus data point berhasil',
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
                    title: 'Hapus data point gagal',
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
        <>
            <IconButton
                isLoading={delLoading}
                variant='outline'
                colorScheme='red'
                aria-label='delete'
                fontSize='20px'
                onClick={async () => {
                    onOpen()
                }}
                icon={<IoTrash />}
            />
            <DeleteAlert isOpen={isOpen} onClick={async () => {
                setDelLoading(true)
                await handleDeletePoint(value)
            }} onClose={onClose} onOpen={onOpen} isLoading={delLoading} title={'Hapus point'} text={'Apa anda yakin ?'} />
        </>
    )
}