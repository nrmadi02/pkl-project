import { Guru, Panggilortu, Siswa, Terlambat, Tindaklanjut } from "@prisma/client";
import moment from "moment";
import { NextPage } from "next";
import Image from "next/image";
import { forwardRef, LegacyRef, ReactNode } from "react";
import LogoSMA from "../../assets/logo/logo-smabat.png";
import LogoKALSEL from "../../assets/logo/logo_kalsel.png";
import "moment/locale/id";

interface Props {
  children?: ReactNode;
  siswa: Siswa | undefined;
  dataTerlambat: Terlambat[] | undefined;
}

export type Ref = HTMLDivElement;

const Surat = (props: Props, ref: LegacyRef<Ref>) => {
//   console.log(props.data);
  return (
    <div className="font-surat p-5" ref={ref}>
      <div className="flex justify-center flex-row gap-7">
        <div>
          <Image src={LogoKALSEL} alt="_logo" width={50} height={60} />
        </div>
        <div className="text-center tracking-wide text-[14px]">
          <p className="font-bold">LAPORAN DATA TERLAMBAT SISWA</p>
          <p className="font-bold">SMA NEGERI 1 BATI-BATI</p>
          <p className="font-bold">TAHUN AJARAN 2022/2023</p>
        </div>
        <div>
          <Image src={LogoSMA} alt="_logo" width={50} height={60} />
        </div>
      </div>
      <div className="mt-5">
        <div className="w-full flex flex-col gap-3">
          <table className="table text-[12px]">
            <tbody>
              <tr>
                <td width={200} className="align-top font-bold">
                  Nama Siswa
                </td>
                <td width={30} className="align-top">
                  :
                </td>
                <td>{props.siswa?.nama}</td>
              </tr>
              <tr>
                <td width={200} className="align-top font-bold">
                   NIS
                </td>
                <td width={30} className="align-top">
                  :
                </td>
                <td>{props.siswa?.nis}</td>
              </tr>
              <tr>
                <td width={200} className="align-top font-bold">
                  Kelas
                </td>
                <td width={30} className="align-top">
                  :
                </td>
                <td>{props.siswa?.kelas}</td>
              </tr>
            </tbody>
          </table>
          <table className="table text-[12px] w-full table-auto border border-collapse">
            <thead>
              <tr>
                <th className="border px-2">No</th>
                <th className="border px-2">Hari, Tanggal</th>
                <th className="border px-2">Waktu Terlambat</th>
                <th className="border px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {props.dataTerlambat?.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td className="border text-center px-2">{idx + 1}</td>
                    <td className="border px-2">
                      {moment(item.tanggal).format("dddd, DD/MM/YYYY")}
                    </td>
                    <td className="border px-2">{item.waktu} Menit</td>
                    <td className="border px-2">
                      {item.akumulasi ? "Sudah" : "Belum"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const RekapTerlambatSiswa = forwardRef<Ref, Props>(Surat);
