import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text, Button, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Popover, PopoverTrigger, Select, useDisclosure, useToast, Divider, Link, Textarea, Badge } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DrawerForm from "../../../components/DrawerForm";
import { trpc } from "../../../utils/trpc";
import Image from "next/image";
import { Guru, Kelas, Pelanggaran, Siswa } from "@prisma/client";
import DataTable from "../../../components/DataTable/DataTable";
import { createSiswaSchema, CreateSiswaSchema, } from "../../../server/schema/siswa.schema";
import { getCookie } from "cookies-next";
import NextLink from 'next/link'
import { createPelanggaranSchema, CreatePelanggaranSchema } from "../../../server/schema/pelanggaran.schema";
import { useSession } from "next-auth/react";

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

const Pelanggaran: NextPage = () => {
    const { data: stateSession } = useSession();
    console.log(stateSession)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure()
    const btnRef = useRef<HTMLButtonElement>(null)
    const [show, setShow] = useState(false)
    const toast = useToast()
    const [selectKelas, setSelectKelas] = useState('')

    interface DataArr {
        nama: string;
        nis: string;
        email: string;
        jenisKelamin: string;
    }

    const { data: dataKelas } = trpc.useQuery(['kelas.getAll'])
    const { data: dataSiswa, isLoading, refetch } = trpc.useQuery(['siswa.getAll', selectKelas], {
        refetchOnWindowFocus: false
    })
    const { data: Periode } = trpc.useQuery(['periode.get'], {
        refetchOnWindowFocus: false
    })

    const getData = (data: Siswa[] | undefined) => {
        const dataNew = data as Siswa[]
        return dataNew
    }

    const columns = useMemo(() => [
        {
            Header: "Nama",
            accessor: (d: Siswa) => {
                return <InfoSiswa data={d} />
            }
        },
        {
            Header: "nama",
            accessor: "nama"
        },
        {
            Header: "Email",
            accessor: "email",
        },
        {
            Header: "Nomor Induk",
            accessor: "nis"
        },
        {
            Header: "Kelas",
            accessor: 'kelas'
        },
        {
            Header: "Point",
            accessor: (d: any) => {
                const dataArr: Pelanggaran[] = d?.pelanggaran ? d.pelanggaran : []
                const arrPoints: number[] = []
                dataArr.map((a, _) => {
                    arrPoints.push(a.point)
                })
                const points = arrPoints.reduce((a, b) => a + b, 0)

                return points
            }
        },
        {
            Header: "Status",
            accessor: (d: any) => {
                const dataArr: Pelanggaran[] = d?.pelanggaran ? d.pelanggaran : []
                const arrPoints: number[] = []
                dataArr.map((a, _) => {
                    arrPoints.push(a.point)
                })
                const points = arrPoints.reduce((a, b) => a + b, 0)

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

                return (
                    <>
                        {points < 15 && <Aman />}
                        {points >= 15 && points < 30 && <PanggilanSatu />}
                        {points >= 30 && points < 45 && <PanggilanDua />}
                        {points >= 45 && <PanggilanTiga />}
                    </>
                )
            }
        },
        {
            Header: "Action",
            accessor: (d: any) => {
                const dataArr: Pelanggaran[] = d?.pelanggaran ? d.pelanggaran : []
                const arrPoints: number[] = []
                dataArr.map((a, _) => {
                    arrPoints.push(a.point)
                })
                const points = arrPoints.reduce((a, b) => a + b, 0)

                return <ActionTable
                    point={points}
                    key={d?.id} dataKelas={dataKelas?.result} value={d?.id} data={d} refetch={refetch} toast={toast} />
            },
        }
    ], [dataSiswa?.result])

    const data = useMemo(() => getData(dataSiswa?.result ? dataSiswa.result : []), [dataSiswa]);


    return (
        <AdminLayout title='Point' breadcrumb={(
            <Breadcrumb>
                <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Tata Tertib</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Point</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        )}>
            <>
                <Head>
                    <title>SMABAT || Tata Tertib</title>
                    <meta name="description" content="Generated by create-t3-app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className="p-5">
                    <Heading size={'md'}>Tahun Ajaran {Periode?.result ? Periode?.result : '-'}</Heading>
                    <div className="flex mb-5 mt-5 flex-col-reverse md:flex-row items-center justify-between">
                        <div className="flex gap-5 w-full flex-row items-center">
                            <p>Filter</p>
                            <Select bg={'white'} w={{ base: 'full', md: '292px' }} onChange={(e) => {
                                setSelectKelas(e.target.value)
                            }} borderColor={'orange.300'} borderWidth={2} id='kelas' placeholder='Kelas ---'>
                                {dataKelas && dataKelas.result.map((itm, idx) => {
                                    return <option key={idx} value={itm.name}>Kelas {itm.name}</option>
                                })}
                            </Select>
                        </div>
                    </div>
                    <DataTable isLoading={isLoading} hiddenColumns={['email', 'nama']} columns={columns} data={data} />
                </div>
            </>
        </AdminLayout>
    )
}

export default Pelanggaran

interface InfoSiswa {
    data: Siswa
}

const InfoSiswa = ({ data }: InfoSiswa) => {
    return (
        <div className="flex flex-row items-center gap-x-[10px]">
            <div className="w-[60px] h-[60px]">
                <Image className="rounded-full" width={60} height={60} alt="_profile" src={data.fotoProfile ? data.fotoProfile : `https://ui-avatars.com/api/?name=${data.nama.split(' ').join('+')}`} />
            </div>
            <NextLink href={`/admin/data/siswa/${data.id}`}>
                <div className="group flex cursor-pointer flex-col gap-y-[5px]">
                    <p className="font-bold group-hover:text-orange-400 transition-all group-hover:scale-105 group-active:scale-100">{data.nama}</p>
                    <p>{data.email}</p>
                </div>
            </NextLink>
        </div>
    )
}


interface ActionValue {
    value: any,
    refetch: any,
    toast: any,
    data: Siswa | any
    dataKelas: Kelas[] | undefined,
    point: number
}

const ActionTable = ({ value, data, refetch, toast, point }: ActionValue) => {
    const { data: stateSession } = useSession();
    const { onOpen, onClose, isOpen } = useDisclosure()
    const firstFieldRef = useRef(null)

    const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting, isDirty, isValid } } = useForm<CreatePelanggaranSchema>({
        resolver: zodResolver(createPelanggaranSchema),
        mode: "onChange"
    });

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

    const { mutateAsync: tambahPelanggaran } = trpc.useMutation('pelanggaran.create')

    const handleAddPelanggaran = useCallback(
        async (data: CreatePelanggaranSchema) => {
            const result: any = await tambahPelanggaran(data);
            if (result.status === 201) {
                onClose()
                reset()
                toast({
                    title: 'Tambah pelanggaran siswa berhasil',
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
                    title: 'Tambah pelanggaran siswa gagal',
                    status: 'error',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
            }
        },
        [tambahPelanggaran]
    );


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
                    setValue('siswaID', data?.id)
                    setValue('pemeberi', stateSession?.user?.name ? stateSession?.user?.name : '')
                }}
                icon={<IoAdd />}
            />
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
                    <div className="flex flex-row gap-5">
                        <div className="w-[190px] h-[220px] cursor-pointer hover:scale-[1.01] transition-all rounded-md border-[2px] border-orange-300">
                            <Image className="rounded-md" width={190} height={220} alt='_img' src={data?.fotoProfile ? data.fotoProfile : `https://ui-avatars.com/api/?name=${data.nama.split(' ').join('+')}`} />
                        </div>
                        <div className="flex gap-3 flex-col text-[18px]">
                            <tr>
                                <td width={60} className="font-bold">Nama</td>
                                <td width={20}>:</td>
                                <td>{data.nama}</td>
                            </tr>
                            <tr>
                                <td width={60} className="font-bold">NIS</td>
                                <td width={20}>:</td>
                                <td>{data.nis}</td>
                            </tr>
                            <tr>
                                <td width={60} className="font-bold">Kelas</td>
                                <td width={20}>:</td>
                                <td>{data.kelas}</td>
                            </tr>
                            <tr>
                                <td width={60} className="font-bold">Point</td>
                                <td width={20}>:</td>
                                <td>{point}</td>
                            </tr>
                            <tr>
                                <td width={60} className="font-bold">Status</td>
                                <td width={20}>:</td>
                                <td>
                                    {point < 15 && <Aman />}
                                    {point >= 15 && point < 30 && <PanggilanSatu />}
                                    {point >= 30 && point < 45 && <PanggilanDua />}
                                    {point >= 45 && <PanggilanTiga />}
                                </td>
                            </tr>
                        </div>
                    </div>
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
        </Flex>
    )
}
