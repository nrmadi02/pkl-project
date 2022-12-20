import { Panggilortu, Siswa, Tindaklanjut } from "@prisma/client";
import moment from "moment";
import { NextPage } from "next";
import Image from "next/image";
import { forwardRef, LegacyRef, ReactNode } from "react";
import LogoSMA from "../../assets/logo/logo-smabat.png";
import LogoKALSEL from "../../assets/logo/logo_kalsel.png";
import "moment/locale/id";

interface Props {
  children?: ReactNode;
  data: Tindaklanjut[] | undefined;
  dataSiswa: Siswa;
}

export type Ref = HTMLDivElement;

const Surat = (props: Props, ref: LegacyRef<Ref>) => {
  console.log(props.data);
  return (
    <div className="font-surat p-5" ref={ref}>
      <div className="flex justify-center flex-row gap-7">
        <div>
          <Image src={LogoKALSEL} alt="_logo" width={50} height={60} />
        </div>
        <div className="text-center tracking-wide text-[14px]">
          <p className="font-bold">REKAPITULASI PELANGGARAN SISWA</p>
          <p className="font-bold">SMA NEGERI 1 BATI-BATI</p>
          <p className="font-bold">TAHUN AJARAN 2022/2023</p>
        </div>
        <div>
          <Image src={LogoSMA} alt="_logo" width={50} height={60} />
        </div>
      </div>
      <div className="mt-5">
        <div className="w-full flex flex-col items-center justify-center gap-3">
          <table className="table text-[12px]">
            <tbody>
              <tr>
                <td width={200} className="align-top font-bold">
                  Nama Siswa
                </td>
                <td width={30} className="align-top">
                  :
                </td>
                <td>{props.dataSiswa.nama}</td>
              </tr>
              <tr>
                <td width={200} className="align-top font-bold">
                  NIS
                </td>
                <td width={30} className="align-top">
                  :
                </td>
                <td>{props.dataSiswa.nis}</td>
              </tr>
              <tr>
                <td width={200} className="align-top font-bold">
                  Kelas
                </td>
                <td width={30} className="align-top">
                  :
                </td>
                <td>{props.dataSiswa.kelas}</td>
              </tr>
            </tbody>
          </table>
          <table className="table text-[12px] table-auto border border-collapse">
            <thead>
              <tr>
                <th className="border px-2">HARI, TANGGAL</th>
                <th className="border px-2">BIDANG BIMBINGAN</th>
                <th className="border px-2">PERMASALAHAN</th>
                <th className="border px-2">PENANGANAN</th>
                <th className="border px-2">TINDAK LANJUT</th>
              </tr>
            </thead>
            <tbody>
              {props.data?.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td className="border px-2">
                      {moment(item.tanggal).format("dddd, DD/MM/YYYY")}
                    </td>
                    <td className="border px-2">{item.type}</td>
                    <td className="border px-2">{item.deskripsi}</td>
                    <td className="border px-2">
                      <p className="whitespace-pre-wrap w-[100px]">
                        {item.penanganan}
                      </p>
                    </td>
                    <td className="border px-2">
                      <p className="whitespace-pre-wrap w-[100px]">
                        {item.tindakan}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-14 text-[12px] flex pr-20 flex-row justify-between">
          <div>
            {/* <div>
              <p>Mengetahui</p>
              <p>Wali Kelas</p>
            </div>
            <div className="mt-16">
              <p>{props.data?.wali_kelas}</p>
              <p>NIP. {props.data?.nip_wali}</p>
            </div> */}
          </div>
          <div>
            <div>
              <p>Bati-Bati, {moment().format("dddd, DD  MMMM  YYYY")}</p>
              <p>Guru BK,</p>
            </div>
            <div className="mt-16">
              <p>Nama :</p>
              <p>NIP :</p>
              {/* <p>{props.data?.nama_bk}</p>
              <p>{props.data?.nip_bk}</p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RekapitulasiPanggilan = forwardRef<Ref, Props>(Surat);
