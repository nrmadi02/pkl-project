import { Panggilortu, Siswa } from "@prisma/client";
import moment from "moment";
import { NextPage } from "next";
import Image from "next/image";
import { forwardRef, LegacyRef, ReactNode } from "react";
import LogoSMA from '../../assets/logo/logo-smabat.png'
import LogoKALSEL from '../../assets/logo/logo_kalsel.png'
import 'moment/locale/id'

interface Props {
    children?: ReactNode;
    data: (Panggilortu & {
        siswa: Siswa;
    }) | null | undefined
}

export type Ref = HTMLDivElement;

const Surat = (props: Props, ref: LegacyRef<Ref>) => {
    return (
        <div className="font-surat p-10" ref={ref}>
            <div className="flex justify-center flex-row gap-3">
                <div>
                    <Image src={LogoKALSEL} alt="_logo" width={100} height={120} />
                </div>
                <div className="text-center tracking-wide">
                    <p className="font-bold">PEMERINTAH PROVINSI KALIMANTAN SELATAN</p>
                    <p className="font-bold">DINAS PENDIDIKAN DAN KEBUDAYAAN</p>
                    <p className="font-bold text-[22px]">SMA NEGERI 1 BATI-BATI</p>
                    <p className="text-[12px]">Jalan A. Yani Km. 33,3 Nusa Indah Kec. Bati-Bati Kab. Tanah Laut 70852</p>
                    <p className="text-[12px]">Telp. /Fax (0512) 26048, Email: <a className="text-blue-500 underline" href="#">sman1bati,bati@gmail.com</a></p>
                    <p className="text-[12px]"><a className="text-blue-500 underline" href="#">www.sman1batibati.sch.id</a></p>
                </div>
                <div>
                    <Image src={LogoSMA} alt="_logo" width={100} height={120} />
                </div>
            </div>
            <div className="w-full mt-[2px] h-[2px] bg-black bg-opacity-80"></div>
            <div className="mt-5">
                <table className="table">
                    <tbody>
                        <tr>
                            <td width={100} className="align-top">Nomor</td>
                            <td width={30} className="align-top">:</td>
                            <td>{props.data?.no_surat}</td>
                        </tr>
                        <tr>
                            <td width={100} className="align-top">Perihal</td>
                            <td width={30} className="align-top">:</td>
                            <td>{props.data?.perihal}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="mt-8">
                    <p>Kepada</p>
                    <p>Yth. Orang Tua/Wali</p>
                    <p>{props.data?.nama_ortu}</p>
                    <p>.........................</p>
                </div>
                <div className="mt-5">
                    <p>Dengan hormat,</p>
                    <p>Sehubung dengan adanya permasalahan yang harus di selesaikan maka bersama ini kami mengundang Bapak/Ibu Orang Tua dan siswa yang bernama {props.data?.siswa.nama} kelas {props.data?.siswa.kelas} untuk datang ke sekolah pada :</p>
                </div>
                <table className="table mt-3">
                    <tbody>
                        <tr>
                            <td width={130} className="align-top">Hari/Tanggal</td>
                            <td width={30} className="align-top">:</td>
                            <td>{moment(props.data?.tanggal).format('dddd, DD MMMM YYYY')}</td>
                        </tr>
                        <tr>
                            <td width={130} className="align-top">Waktu</td>
                            <td width={30} className="align-top">:</td>
                            <td>{props.data?.waktu} WITA</td>
                        </tr>
                        <tr>
                            <td width={130} className="align-top">Tempat</td>
                            <td width={30} className="align-top">:</td>
                            <td>{props.data?.tempat}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="mt-5">
                    <p>Mengingat pentingnya hal tersebut maka kami mengharapkan sekali kehadiran Bapak/Ibu untuk datang tepat pada waktu yang telah ditentukan.</p>
                    <p>Demikian undangan ini disampaikan atas perhatiannya kami ucapkan terima kasih.</p>
                </div>
                <div className="mt-14 flex pr-20 flex-row justify-between">
                    <div>
                        <div>
                            <p>Mengetahui</p>
                            <p>Wali Kelas</p>
                        </div>
                        <div className="mt-16">
                            <p>{props.data?.wali_kelas}</p>
                            <p>NIP. {props.data?.nip_wali}</p>
                        </div>
                    </div>
                    <div>
                        <div>
                            <p>Bati-Bati, Senin 20 Juli 2022</p>
                            <p>Guru BK,</p>
                        </div>
                        <div className="mt-16">
                            <p>{props.data?.nama_bk}</p>
                            <p>{props.data?.nip_bk}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const SuratPanggilanOrtu = forwardRef<Ref, Props>(Surat)