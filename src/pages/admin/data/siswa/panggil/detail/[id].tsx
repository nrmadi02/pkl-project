import { ArrowBackIcon, DownloadIcon } from "@chakra-ui/icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Heading } from "@chakra-ui/react";
import { Panggilortu } from "@prisma/client";
import { getCookie } from "cookies-next";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { createRef, LegacyRef, useEffect, useRef, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useReactToPrint } from "react-to-print";
import AdminLayout from "../../../../../../components/Layout/AdminLayout";
import { SuratPanggilanOrtu } from "../../../../../../components/Surat/SuratPanggilanOrtu";
import prismaFront from "../../../../../../server/db/front";
import { trpc } from "../../../../../../utils/trpc";

export const getServerSideProps: GetServerSideProps<{ data: Panggilortu }> = async (ctx) => {
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

    const data = await prismaFront.panggilortu.findFirst({
        where: {
            id: String(ctx.params?.id)
        }
    })

    if (!data) {
        return {
            redirect: {
                destination: "/admin/data/siswa",
                permanent: false,
            },
        };
    }

    return {
        props: {
            data: JSON.parse(JSON.stringify(data))
        }
    }
}


const PanggilOrangTua: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { data: stateSession } = useSession();
    const router = useRouter()
    const componentRef = createRef<HTMLDivElement>();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const ref = useRef<any>()
    const [isServer, setIsServer] = useState(false)

    useEffect(() => {
        window && setIsServer(true)
    }, [])


    const { data: dataPanggilan } = trpc.useQuery(['panggil.getDetailByID', data.id])


    return (
        <AdminLayout title='Detail Panggilan' breadcrumb={(
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
                    <title>SMABAT || Detail Panggilan</title>
                    <meta name="description" content="Generated by create-t3-app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className="px-5 pt-2">
                    <Button onClick={() => {
                        router.back()
                    }} leftIcon={<ArrowBackIcon />} color="orange.400" variant={'ghost'}>
                        Kembali
                    </Button>
                </div>
                <div className="px-5 md:px-20 py-2 pb-5">

                    {/* <Heading mt={'4'} size={'md'}>Detail Panggilan</Heading> */}
                    {/* {isServer && <Scrollbars ref={ref} style={{ width: '800px', height: "1000px" }}> */}
                    <div className='p-5 md:p-10 min-w-[800px] overflow-auto my-5 bg-white rounded shadow'>
                        <SuratPanggilanOrtu ref={componentRef} data={dataPanggilan?.result} />
                    </div>
                    {/* </Scrollbars>} */}
                    <Button onClick={handlePrint} colorScheme={'orange'} position={'fixed'} bottom={'10'} right={"10"} leftIcon={<DownloadIcon />}>
                        Print
                    </Button>
                </div>
            </>
        </AdminLayout>
    )
}

export default PanggilOrangTua;